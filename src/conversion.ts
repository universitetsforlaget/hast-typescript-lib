import {
  HastNode,
  HastBodyNode,
} from './types';

/** Convert plaintext string to hast body */
export const stringToHast = (text: string): HastBodyNode => ({
  type: 'element',
  tagName: 'body',
  children: [{
    type: 'text',
    value: text,
  }]
});
