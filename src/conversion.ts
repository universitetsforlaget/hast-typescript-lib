import { HastNode, HastTextNode, HastFragmentNode } from './types';
import * as dom from './dom';
import * as serialization from './serialization';
import { compressFragmentNode } from './util';
import { DeserializationConfig, SerializationConfig } from './config';

/** Convert plaintext string to hast text node */
export const stringToHast = (text: string): HastTextNode => ({
  type: 'text',
  value: text,
});

/** Create a fragment enclosing the given nodes */
export const createFragment = (...nodes: HastNode[]): HastFragmentNode =>
  compressFragmentNode({
    type: 'element',
    tagName: 'fragment',
    children: nodes,
  });

/** Convert any dom node to hast, if possible */
export const domNodeToHast = (node: Node, config: DeserializationConfig): HastNode | null =>
  dom.nodeToHast(node, config);

/** Convert a dom node's content (i.e. children) to a hast fragment */
export const domNodeToHastFragment = (
  node: Node,
  config: DeserializationConfig
): HastFragmentNode => createFragment(...dom.nodeChildrenToHastArray(node, config));

/** Convert hast to html5 string (fragment nodes will be stripped) */
export const hastToHtml5 = (node: HastNode, config: SerializationConfig): string => {
  return serialization.hastNodeToUtf8Markup(node, config);
};
