import {
  HastBodyNode,
} from './types';
import { compressBodyNode } from './util';
import { hastChildrenOfElement } from './dom';

/** Convert plaintext string to hast body */
export const stringToHastBody = (text: string): HastBodyNode => ({
  type: 'element',
  tagName: 'body',
  children: [{
    type: 'text',
    value: text,
  }]
});

export const domElementToHastBody = (root: Element): HastBodyNode => compressBodyNode({
  type: 'element',
  tagName: 'body',
  children: hastChildrenOfElement(root),
});
