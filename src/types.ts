export interface HastProperties {
  className?: string[],
  [key: string]: any,
}

export interface HastTextNode {
  type: 'text';
  value: string;
};

export interface HastElementNode {
  type: 'element';
  tagName: string;
  properties?: HastProperties;
  children?: HastNode[];
};

export type HastNode = HastTextNode | HastElementNode;
