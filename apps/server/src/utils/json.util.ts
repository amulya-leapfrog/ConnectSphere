import { snakeToCamelCase } from './string.util';

import {
  Edge,
  Vertex,
  Element,
  GremlinEdge,
  GremlinVertex,
  GremlinElement,
} from '@/interfaces/gremlin/gremlin.interface';

export function mapToJSON(result: Array<GremlinElement>): Array<Element> {
  return result.map(processElement);
}

/**
 * Process a vertex from Gremlin into a plain JS object.
 * @param {Object} vertex - The vertex to process.
 * @returns {Object} - The processed vertex.
 */
const processVertex = (vertex: GremlinVertex): Vertex => ({
  type: 'vertex',
  id: vertex.id,
  label: vertex.label,
  properties: processProperties(vertex.properties),
});

/**
 * Process an edge from Gremlin into a plain JS object.
 * @param {Object} edge - The edge to process.
 * @returns {Object} - The processed edge.
 */
const processEdge = (edge: GremlinEdge): Edge => ({
  type: 'edge',
  id: edge.id,
  label: edge.label,
  properties: processProperties(edge.properties),
  from: edge.outV,
  to: edge.inV,
});

/**
 * Process a map into a plain JS object.
 * @param {Map} element - The map to process.
 * @returns {Object} - The processed map.
 */
const processMap = (element: Map<string, object>): Record<string, object> => {
  const result: Record<string, object> = {};

  for (const [key, value] of element.entries()) {
    result[snakeToCamelCase(key)] = processElement(value as GremlinElement);
  }

  return result;
};

/**
 * Process an array into a plain JS object.
 * @param {Array} element - The array to process.
 * @returns {Array} - The processed array.
 */
const processArray = (element: Array<object>): Array<Element> =>
  element.map((el: object) => processElement(el as GremlinElement));

/**
 * Helper function to convert a complex structure into a plain JS object.
 * @param {Object} element - The object to process.
 * @returns {Object} - The processed object.
 */
const processElement = (element: GremlinElement): Element => {
  if (typeof element === 'object') {
    if (
      'label' in element &&
      'id' in element &&
      !('outV' in element) &&
      !('inV' in element)
    ) {
      return processVertex(element);
    }

    if ('outV' in element && 'inV' in element) {
      return processEdge(element as GremlinEdge);
    }

    if (element instanceof Map) {
      return processMap(element);
    }

    if (Array.isArray(element)) {
      return processArray(element);
    }
  }

  return element as Record<string, object>;
};

/**
 * Helper function to convert property values (lists) into arrays.
 * @param {Map} properties - The properties to process.
 * @returns {Object} - The processed properties.
 */
const processProperties = (
  properties: Map<string, Array<{ value: object }>>,
): Record<string, object> => {
  const result: Record<string, object> = {};

  for (const [key, values] of properties.entries()) {
    result[snakeToCamelCase(key)] = values.map((value) => value.value);
  }

  return result;
};
