import { DOMParser } from 'xmldom';

import * as conversion from '../conversion';
import * as config from '../config';

const html5Config = config.html5DeserializationConfig();

const HTML_SPAN_DOC = new DOMParser().parseFromString(
  '<span>Some <STRONG>text</STRONG></span>',
  'text/html'
);

const HTML_UNENCLOSED_DOC = new DOMParser().parseFromString(
  'Some <STRONG>text</STRONG>',
  'text/html'
);

describe('conversion', () => {
  it('converts full html document to fragment', () => {
    const fragment = conversion.domNodeToHastFragment(HTML_SPAN_DOC, html5Config);

    expect(fragment).toEqual({
      type: 'element',
      tagName: 'fragment',
      children: [
        {
          type: 'element',
          tagName: 'span',
          children: [
            {
              type: 'text',
              value: 'Some ',
            },
            {
              type: 'element',
              tagName: 'strong',
              children: [
                {
                  type: 'text',
                  value: 'text',
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('does not contain unenclosed text elements', () => {
    const fragment = conversion.domNodeToHastFragment(HTML_UNENCLOSED_DOC, html5Config);

    expect(fragment).toEqual({
      type: 'element',
      tagName: 'fragment',
      children: [
        {
          type: 'element',
          tagName: 'strong',
          children: [
            {
              type: 'text',
              value: 'text',
            },
          ],
        },
      ],
    });
  });
});
