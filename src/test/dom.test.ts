import { DOMParser } from 'xmldom';

import * as dom from '../dom';
import * as config from '../config';

const xmlConfig = config.xmlDeserializationConfig();
const html5Config = config.html5DeserializationConfig();

const XML_DOC = new DOMParser().parseFromString(
  '<Yo />',
  'text/xml',
);

const COMMENT_DOC = new DOMParser().parseFromString(
  '<span>foo <!-- comment --> bar</span>',
  'text/html',
);

const LABEL_DOC = new DOMParser().parseFromString(
  '<label class="foo" for="bar">baz</label>',
  'text/html',
);

const INPUT_DOC = new DOMParser().parseFromString(
  '<input minlength="2" />',
  'text/html',
);

describe('dom', () => {
  it('does not convert document to hast', () => {
    expect(dom.nodeToHast(XML_DOC, xmlConfig)).toEqual(null);
  });

  it('converts xml document to hast, retains tagName casing', () => {
    expect(dom.nodeToHast(XML_DOC.childNodes[0], xmlConfig)).toEqual({
      type: 'element',
      tagName: 'Yo',
    });
  });

  it('skips comments', () => {
    expect(dom.nodeToHast(COMMENT_DOC.childNodes[0], html5Config)).toEqual({
      type: 'element',
      tagName: 'span',
      children: [{
        type: 'text',
        value: 'foo ',
      }, {
        type: 'text',
        value: ' bar',
      }],
    });
  });

  it('encodes special names', () => {
    expect(dom.nodeToHast(LABEL_DOC.childNodes[0], html5Config)).toEqual({
      type: 'element',
      tagName: 'label',
      properties: {
        className: ['foo'],
        htmlFor: 'bar',
      },
      children: [{
        type: 'text',
        value: 'baz',
      }],
    });
  });

  it('does something with attribute', () => {
    expect(dom.nodeToHast(INPUT_DOC.childNodes[0], html5Config)).toEqual({
      type: 'element',
      tagName: 'input',
      properties: {
        minLength: '2',
      },
    });
  });
});
