import {
  HastBodyNode, ContentType,
} from './types';
import { compressBodyNode } from './util';
import { hastChildrenOfElement } from './dom';
import { hastNodeToUtf8Markup } from './serialization';

/** Convert plaintext string to hast body */
export const stringToHastBody = (text: string): HastBodyNode => ({
  type: 'element',
  tagName: 'body',
  children: [{
    type: 'text',
    value: text,
  }]
});

/** Convert any dom Element to hast body */
export const domElementToHastBody = (
  root: Element,
  contentType: ContentType,
): HastBodyNode => compressBodyNode({
  type: 'element',
  tagName: 'body',
  children: hastChildrenOfElement(root, contentType),
});

/** Convert any hast body node to "flattened" html5 (body node is stripped) */
export const hastBodyToFlattenedHtml5 = (body: HastBodyNode): string => {
  return body.children
    ? body.children.map(hastNodeToUtf8Markup).join('')
    : '';
};
