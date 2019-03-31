import { hastNodeToUtf8Markup } from "../serialization";
import * as config from '../config';

const htmlAttributeMap = config.compileAttributeMap(require('react-html-attributes'));
const html5Config = config.html5SerializationConfig(htmlAttributeMap);

describe('serialization', () => {
  it('serializes text node', () => {
    const html = hastNodeToUtf8Markup({
      type: 'text',
      value: '<html tags & stuff>',
    }, html5Config);
    expect(html).toEqual(
      '&lt;html tags &amp; stuff&gt;'
    );
  });

  it('serializes element node', () => {
    const html = hastNodeToUtf8Markup({
      type: 'element',
      tagName: 'img',
      properties: {
        src: 'http://"image"'
      }
    }, html5Config);
    expect(html).toEqual(
      '<img src="http://&quot;image&quot;"/>'
    );
  });

  it('serializes element node with children', () => {
    const html = hastNodeToUtf8Markup({
      type: 'element',
      tagName: 'p',
      properties: {
        className: ['foo', 'bar'],
      },
      children: [{
        type: 'text',
        value: 'tekst',
      }, {
        type: 'element',
        tagName: 'br',
      }, {
        type: 'element',
        tagName: 'div',
        properties: {
          'data-foo': 'bar',
        },
      }, {
        type: 'element',
        tagName: 'input',
        properties: {
          autoComplete: true,
        },
      }, {
        type: 'element',
        tagName: 'img',
        properties: {
          srcSet: 'yo',
        }
      }, {
        type: 'element',
        tagName: 'strong',
        children: [{
          type: 'text',
          value: 'yo',
        }]
      }],
    }, html5Config);
    expect(html).toEqual(
      '<p class="foo bar">tekst<br/><div data-foo="bar"/><input autocomplete/><img srcset="yo"/><strong>yo</strong></p>'
    );
  });
});
