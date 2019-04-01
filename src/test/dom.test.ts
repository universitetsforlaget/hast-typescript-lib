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

const FORM_DOC = new DOMParser().parseFromString(
  '<form accept-charset="foo" method="POST" foo="bar"><input minlength="2" /></form>',
  'text/html',
);

const BOOL_ATTR_DOC = new DOMParser().parseFromString(
  '<input autocomplete="on"/>',
  'text/html',
);

const TEXT_ENTITIES_DOC = new DOMParser().parseFromString(
  'Bl&aring;b&aelig;rsyltet&oslash;y',
  'text/html',
);

const TEXT_UTF8_DOC = new DOMParser().parseFromString(
  'Blåbærsyltetøy',
  'text/html',
);

const DATA_DOC = new DOMParser().parseFromString(
  '<div data-foo="bar" />',
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
        htmlFor: ['bar'],
      },
      children: [{
        type: 'text',
        value: 'baz',
      }],
    });
  });

  it('transforms html attribute name to react-compliant camelCase naming', () => {
    expect(dom.nodeToHast(FORM_DOC.childNodes[0], html5Config)).toEqual({
      type: 'element',
      tagName: 'form',
      properties: {
        acceptCharset: ['foo'],
        method: 'POST',
        foo: 'bar',
      },
      children: [{
        type: 'element',
        tagName: 'input',
        properties: {
          minLength: '2',
        },
      }],
    });
  });

  it('parses "boolean" attributes as string', () => {
    expect(dom.nodeToHast(BOOL_ATTR_DOC.childNodes[0], html5Config)).toEqual({
      type: 'element',
      tagName: 'input',
      properties: {
        autoComplete: ['on'],
      },
    });
  });

  it('keeps character entities', () => {
    expect(dom.nodeToHast(TEXT_ENTITIES_DOC.childNodes[0], html5Config)).toEqual({
      type: 'text',
      value: 'Bl&aring;b&aelig;rsyltet&oslash;y',
    });
  });

  it('accepts utf-8', () => {
    expect(dom.nodeToHast(TEXT_UTF8_DOC.childNodes[0], html5Config)).toEqual({
      type: 'text',
      value: 'Blåbærsyltetøy',
    });
  });

  it('retains data attribute', () => {
    expect(dom.nodeToHast(DATA_DOC.childNodes[0], html5Config)).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {
        'data-foo': 'bar',
      },
    })
  })
});
