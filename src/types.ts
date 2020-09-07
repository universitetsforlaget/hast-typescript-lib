export interface HastProperties {
  className?: string[];
  [key: string]: any;
}

export interface HastTextNode {
  type: 'text';
  value: string;
}

export interface HastElementNode {
  type: 'element';
  tagName: string;
  properties?: HastProperties;
  children?: HastNode[];
}

/**
 * The "fragment" element is a special construct and is used
 * when several elements are being represented in order as an array,
 * without any specified wrapper node. In other words, the fragment element
 * should always be removed from a DOM tree, its children merged into the fragment's
 * siblings, if any.
 */
export interface HastFragmentNode {
  type: 'element';
  tagName: 'fragment';
  children?: HastNode[];
}

export type HastNode = HastTextNode | HastElementNode;
