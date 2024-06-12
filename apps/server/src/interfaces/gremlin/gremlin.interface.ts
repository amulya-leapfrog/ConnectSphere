import { process } from 'gremlin';

export interface Vertex {
  type: 'vertex';
  id: string;
  label: string;
  properties: Record<string, object>;
}

export interface Edge {
  type: 'edge';
  id: string;
  label: string;
  properties: Record<string, object>;
  from: string;
  to: string;
}

export interface GremlinVertex {
  id: string;
  label: string;
  properties: Map<string, Array<{ value: object }>>;
}

export interface GremlinEdge extends GremlinVertex {
  outV: string;
  inV: string;
}

export type Element = Vertex | Edge | Record<string, object> | Array<object>;

export type GremlinElement =
  | GremlinVertex
  | GremlinEdge
  | Map<string, object>
  | Array<object>;

export type Traversal = process.GraphTraversal;
export type TraversalSource = process.GraphTraversalSource;

export type GremlinResult =
  | Vertex
  | Edge
  | Record<string, object>
  | Array<GremlinResult>;
