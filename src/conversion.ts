import {
  HastNode,
  HastTextNode,
  HastFragmentNode,
  ContentType,
} from './types';
import * as dom from './dom';
import * as serialization from './serialization';
import { compressFragmentNode } from './util';

/** Convert plaintext string to hast text node */
export const stringToHast = (text: string): HastTextNode => ({
  type: 'text',
  value: text,
});

/** Convert any dom node to hast, if possible */
export const domNodeToHast = (
  node: Node,
  contentType: ContentType,
): HastNode | null => dom.nodeToHast(node, contentType);

/** Convert a dom node's content to a hast fragment */
export const domNodeToHastFragment = (
  node: Node,
  contentType: ContentType,
): HastFragmentNode => compressFragmentNode({
  type: 'element',
  tagName: 'fragment',
  children: dom.nodeChildrenToHastArray(node, contentType),
});

/** Convert hast to html5 string (fragment nodes will be stripped) */
export const hastToHtml5 = (node: HastNode): string => {
  return serialization.hastNodeToUtf8Markup(node);
};
