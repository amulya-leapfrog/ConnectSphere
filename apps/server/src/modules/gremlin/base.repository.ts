import { process } from 'gremlin';

import { Logger } from '@nestjs/common';

import { GremlinService } from './gremlin.service';

import {
  Traversal,
  GremlinElement,
} from '@/interfaces/gremlin/gremlin.interface';

import { mapToJSON } from '@/utils/json.util';

const { statics } = process;

export class BaseRepository {
  protected logger: Logger;

  constructor(
    protected readonly gremlinService: GremlinService,
    protected readonly vertexLabel: string,
  ) {
    this.logger = new Logger(BaseRepository.name);
  }

  /**
   * Executes a traversal, unfolding its value map into a list.
   *
   * @param {Traversal} traversal
   * @param {(traversal: Traversal) => void} callback
   * @returns {Promise<GremlinElement[]>}
   */
  async executeTraversal(
    traversal: Traversal,
    callback?: (traversal: Traversal) => void,
  ): Promise<GremlinElement[]> {
    // Changing the return type here
    const steps = this.extractSteps(traversal.toString());
    const isSelectPresent = steps.some((step) => step.includes('select'));
    const isValueMapPresent = steps.some((step) => step.includes('valueMap'));

    if (isSelectPresent) {
      traversal.by(statics.valueMap(true).by(statics.unfold())).dedup();
    } else if (isValueMapPresent) {
      traversal.by(statics.unfold()).dedup();
    } else {
      traversal.valueMap(true).by(statics.unfold()).dedup();
    }

    callback && callback(traversal);

    return traversal.toList() as Promise<GremlinElement[]>;
  }

  /**
   * Logs the Gremlin query to the console.
   *
   * @param {Traversal} traversal
   * @param {number} startTime
   * @param {boolean} hasError
   */
  log(traversal: Traversal, startTime: number, hasError: boolean = false) {
    const executionTime = Date.now() - startTime;

    if (hasError) {
      this.logger.error(`\n${this.getQuery(traversal)}, (${executionTime}ms)`);
    } else {
      this.logger.log(`\n${this.getQuery(traversal)}, (${executionTime}ms)`);
    }
  }

  /**
   * Executes a traversal, unfolding its value map into a list.
   *
   * @param {Traversal} traversal - The traversal object to process.
   * @returns {Promise<T[]>} - A promise of a list of unfolded value maps.
   *
   * @example
   * let result = await execute(traversal);
   * console.log(result);
   */
  async execute<T>(
    traversal: Traversal,
    callback?: (traversal: Traversal) => void,
  ): Promise<T[]> {
    const startTime = Date.now();

    try {
      const rawData = await this.executeTraversal(traversal, callback);

      const result = mapToJSON(rawData) as T[];

      this.log(traversal, startTime);
      return result;
    } catch (error) {
      this.log(traversal, startTime, true);
      throw error;
    }
  }

  /**
   * Get the Gremlin query as a string from a given Gremlin traversal.
   *
   * @param {process.GraphTraversal} traversal - The Gremlin traversal to extract the query from.
   * @returns {string} - The Gremlin query as a string.
   *
   * @example
   * const traversal = g.V().has('name', 'Alice').out('knows');
   * const query = getQuery(traversal);
   */
  getQuery(traversal: process.GraphTraversal): string {
    // Create an instance of the translator
    const translator = this.gremlinService.getTranslator();

    // Get the Bytecode from the traversal
    const bytecode = traversal.getBytecode();

    // Translate the Bytecode into a Gremlin script (query)
    return translator.translate(bytecode);
  }

  /**
   * Extract the individual steps from a Gremlin query string.
   *
   * @param {string} query - The Gremlin query as a string.
   * @returns {string[]} - An array containing the individual steps of the query.
   *
   * @example
   * const query = "g.V().has('name', 'Alice').out('knows')";
   * const steps = extractSteps(query);
   */
  private extractSteps(query: string): string[] {
    // Regular expression pattern to match individual steps in the query
    const pattern = /\[.*?\]/g;

    // Extract the steps from the Gremlin script using the pattern
    const steps = query.match(pattern) || [];

    // Trim each step to remove any leading/trailing whitespace
    return steps.map((step) => step.trim());
  }
}
