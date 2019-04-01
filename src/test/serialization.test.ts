import { hastNodeToUtf8Markup } from "../serialization";
import * as config from '../config';

const html5Config = config.html5SerializationConfig();

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
          autoComplete: 'on',
        },
      }, {
        type: 'element',
        tagName: 'img',
        properties: {
          srcSet: ['foo', 'bar'],
        }
      }, {
        type: 'element',
        tagName: 'button',
        properties: {
          disabled: true,
        },
      }, {
        type: 'element',
        tagName: 'button',
        properties: {
          disabled: false,
        },
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
      '<p class="foo bar">tekst<br/><div data-foo="bar"/><input autocomplete="on"/><img srcset="foo, bar"/><button disabled/><button/><strong>yo</strong></p>'
    );
  });

  it('serializes fragments', () => {
    const html = hastNodeToUtf8Markup({
      type: 'element',
      tagName: 'fragment',
      children: [{
        type: 'text',
        value: 'foo',
      }, {
        type: 'element',
        tagName: 'fragment',
        children: [{
          type: 'text',
          value: 'bar',
        }]
      }]
    }, html5Config);
    expect(html).toEqual('foobar');
  });
});
