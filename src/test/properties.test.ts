import * as properties from '../properties';

describe('properties', () => {
  it('converts hast html properties to js', () => {
    const hastHtmlProperties = {
      className: ['a', 'b'],
      'data-foo': { foo: 'bar' },
    };

    expect(properties.hastPropertiesToJs(
      properties.htmlSpace,
      hastHtmlProperties,
    )).toEqual({
      className: 'a b',
      'data-foo': { foo: 'bar' },
    });
  });
});
