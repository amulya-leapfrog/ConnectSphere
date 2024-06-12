import { driver, process } from 'gremlin';

import { Injectable, OnModuleDestroy } from '@nestjs/common';

const traversal = process.AnonymousTraversalSource.traversal;

@Injectable()
export class GremlinService implements OnModuleDestroy {
  private client: process.GraphTraversalSource;
  private translator: process.Translator;
  private connection: driver.DriverRemoteConnection;

  constructor() {
    this.connection = new driver.DriverRemoteConnection(
      'ws://localhost:8182/gremlin',
    );

    // Instantiate the gremlin client and connect to a gremlin server
    this.client = traversal().withRemote(this.connection);
    this.translator = new process.Translator(this.client);
  }

  /**
   * Get the Gremlin client instance.
   *
   * @returns The Gremlin client instance.
   */
  getClient() {
    return this.client;
  }

  getTranslator() {
    return this.translator;
  }

  /**
   * Lifecycle method called when the module is being destroyed.
   *
   * Closes the Gremlin client connection.
   */
  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
    }
  }
}
