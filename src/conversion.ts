import {
  HastFragmentNode, ContentType,
} from './types';
import { compressFragmentNode } from './util';
import { hastChildrenOfNode } from './dom';
import { hastNodeToUtf8Markup } from './serialization';

/** Convert plaintext string to hast fragment */
export const stringToHastFragment = (text: string): HastFragmentNode => ({
  type: 'element',
  tagName: 'fragment',
  children: [{
    type: 'text',
    value: text,
  }]
});

/** Convert any dom Element to hast fragment */
export const domElementToHastFragment = (
  root: Node,
  contentType: ContentType,
): HastFragmentNode => compressFragmentNode({
  type: 'element',
  tagName: 'fragment',
  children: hastChildrenOfNode(root, contentType),
});

/** Convert any hast fragment to "flattened" html5 (fragment node is stripped) */
export const hastFragmentToFlattenedHtml5 = (fragment: HastFragmentNode): string => {
  return fragment.children
    ? fragment.children.map(hastNodeToUtf8Markup).join('')
    : '';
};
