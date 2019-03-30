import { DOMParser } from 'xmldom';
import { domElementToHastFragment } from '../conversion';

describe('conversion', () => {
  it('converts html document', () => {
    const doc = new DOMParser().parseFromString('<span>Some <STRONG>text</STRONG></span>', 'text/html');
    const hast = domElementToHastFragment(doc, 'text/html');
    expect(hast).toEqual({
      type: 'element',
      tagName: 'fragment',
      children: [{
        type: 'element',
        tagName: 'span',
        children: [{
          type: 'text',
          value: 'Some ',
        }, {
          type: 'element',
          tagName: 'strong',
          children: [{
            type: 'text',
            value: 'text',
          }],
        }],
      }]
    });
  });
});
