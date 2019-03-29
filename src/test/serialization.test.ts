import { hastNodeToUtf8Markup } from "../serialization";

describe('serialization', () => {
  it('serializes text node', () => {
    const html = hastNodeToUtf8Markup({
      type: 'text',
      value: '<html tags & stuff>',
    });
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
    });
    expect(html).toEqual(
      '<img src="http://&quot;image&quot;"/>'
    );
  });

  it('serializes element node with children', () => {
    const html = hastNodeToUtf8Markup({
      type: 'element',
      tagName: 'p',
      properties: {
        class: 'yo',
      },
      children: [{
        type: 'text',
        value: 'tekst',
      }, {
        type: 'element',
        tagName: 'br'
      }],
    });
    expect(html).toEqual(
      '<p class="yo">tekst<br /></p>'
    );
  });
});
