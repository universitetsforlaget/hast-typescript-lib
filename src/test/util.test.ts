import { compressDocument } from '../util';

describe('util', () => {
  it('compresses document correctly', () => {
    const compressedDocument = compressDocument({
      type: 'element',
      tagName: 'fragment',
      properties: {},
      children: [
        {
          type: 'element',
          tagName: 'child',
          properties: {},
        },
      ],
    });

    const expectedDocument = {
      type: 'element',
      tagName: 'fragment',
      children: [
        {
          type: 'element',
          tagName: 'child',
        },
      ],
    };

    expect(compressedDocument).toEqual(expectedDocument);
  });
});
