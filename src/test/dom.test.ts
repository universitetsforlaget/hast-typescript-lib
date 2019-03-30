import { DOMParser } from 'xmldom';

import * as dom from '../dom';

const XML_DOC = new DOMParser().parseFromString('<Yo />', 'text/xml');

describe('dom', () => {
  it('does not convert document to hast', () => {
    expect(dom.nodeToHast(XML_DOC, 'application/xml')).toEqual(null);
  });

  it('converts xml document to hast, retains tagName casing', () => {
    const hast = dom.nodeToHast(
      XML_DOC.childNodes[0],
      'application/xml',
    );
    expect(hast).toEqual({
      type: 'element',
      tagName: 'Yo',
    });
  });
});
