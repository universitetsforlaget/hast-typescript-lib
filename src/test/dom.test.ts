import { DOMParser } from 'xmldom';
import { hastOfElement } from '../dom';

describe('dom', () => {
  it('converts xml document to hast, retains tagname casing', () => {
    const doc = new DOMParser().parseFromString('<Yo />', 'text/xml');
    const hast = hastOfElement(
      doc.childNodes[0] as Element,
      'application/xml'
    );
    expect(hast).toEqual({
      type: 'element',
      tagName: 'Yo',
    });
  });
});
