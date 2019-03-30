import { DOMParser } from 'xmldom';

import { elementToHast } from '../dom';

describe('dom', () => {
  it('converts xml document to hast, retains tagName casing', () => {
    const doc = new DOMParser().parseFromString('<Yo />', 'text/xml');
    const hast = elementToHast(
      doc.childNodes[0] as Element,
      'application/xml'
    );
    expect(hast).toEqual({
      type: 'element',
      tagName: 'Yo',
    });
  });
});
