import { HastProperties } from "./types";

export interface SerializationConfig {
  serializeTagName: (name: string) => string | null;
  serializeAttribute: (
    tagName: string,
    name: string,
    value: any
  ) => [string, string] | string | null;
};

export interface DeserializationConfig {
  deserializeTagName: (name: string) => string | null;
  deserializeAttribute: (
    tagName: string,
    name: string,
    value: string | null
  ) => HastProperties;
};

export interface HtmlAttributeMap {
  toHtml: { [tagName: string]: { [ camelCased: string]: string }},
  toHast: { [tagName: string]: { [ lowercased: string]: string }},
};

/**
 * Compile html attribute map, that can mostly correctly convert between HTML and HAST attributes.
 * Hast attribute names are compatible with attributes used by DOM js APIs (and React).
 * @param reactHtmlAttributes The default export of npm module 'react-html-attributes'
 */
export const compileAttributeMap = (
  reactHtmlAttributes: { [key: string]: string[] },
): HtmlAttributeMap => {
  return {
    toHtml: Object.keys(reactHtmlAttributes).reduce((tags, key) => {
      if (key === 'elements') return tags;
      return {
        ...tags,
        [key]: reactHtmlAttributes[key].reduce((attrs, attribute) => ({
          ...attrs,
          [attribute]: attribute.toLowerCase(),
        }), {})
      };
    }, {}),
    toHast: Object.keys(reactHtmlAttributes).reduce((tags, key) => {
      if (key === 'elements') return tags;
      return {
        ...tags,
        [key]: reactHtmlAttributes[key].reduce((attrs, attribute) => ({
          ...attrs,
          [attribute.toLowerCase()]: attribute,
        }), {}),
      };
    }, {}),
  };
}

export const html5SerializationConfig = (
  attributeMap: HtmlAttributeMap,
): SerializationConfig => ({
  serializeTagName: name => name,
  serializeAttribute: (tagName, name, value) => {
    if (name === 'className') {
      return ['class', value.join(' ')];
    } else if (name === 'htmlFor') {
      return ['for', `${value}`];
    } else if (name.startsWith('data-') || name.startsWith('aria-')) {
      return [name, `${value}`];
    } else {
      const serializedName =
        attributeMap.toHtml[tagName] && attributeMap.toHtml[tagName][name]
        || attributeMap.toHtml['*'][name]
        || null;

      if (!serializedName) return null;
      return [serializedName, `${value}`];
    }
  }
});

export const html5DeserializationConfig = (
  attributeMap: HtmlAttributeMap,
): DeserializationConfig => ({
  deserializeTagName: name => name.toLowerCase(),
  deserializeAttribute: (tagName: string, name, value) => {
    if (name === 'class') {
      return {
        className: (value || '').split(' ').filter(Boolean),
      };
    } else if (name === 'for') {
      return {
        htmlFor: value,
      };
    } else if (name.startsWith('data-') || name.startsWith('aria-')) {
      // Just convert to lower case
      return {
        [name.toLowerCase()]: value,
      };
    } else {
      // To camelCase
      const normalizedName = name.replace(/-([a-z])/g, '').toLowerCase();

      const propertyName =
        (attributeMap.toHast[tagName] && attributeMap.toHast[tagName][normalizedName])
        || attributeMap.toHast['*'][normalizedName]
        || null;

      return propertyName
        ? { [propertyName]: value }
        : {};
    }
  },
});

export const xmlSerializationConfig = (): SerializationConfig => ({
  serializeTagName: name => name,
  serializeAttribute: (tagName, name, value) => [name, `${value}`],
});

export const xmlDeserializationConfig = (): DeserializationConfig => ({
  deserializeTagName: name => name,
  deserializeAttribute: (tagName, name, value) => ({ [name]: value }),
});
