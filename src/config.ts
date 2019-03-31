import { HastProperties } from "./types";

export type ContentType = 'text/html' | 'application/xml';

export interface SerializationConfig {
  contentType: ContentType;
  serializeTagName: (name: string) => string | null;
  serializeAttributeName: (tagName: string, attributeName: string) => string | null;
};

export interface DeserializationConfig {
  contentType: ContentType;
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
  contentType: 'text/html',
  serializeTagName: name => name,
  serializeAttributeName: (tagName, attributeName) => {
    return attributeName;
  }
});

export const html5DeserializationConfig = (
  attributeMap: HtmlAttributeMap,
): DeserializationConfig => ({
  contentType: 'text/html',
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

export const xmlSerializationConfig = (

): SerializationConfig => ({
  contentType: 'application/xml',
  serializeTagName: name => name,
  serializeAttributeName: name => name,
});

export const xmlDeserializationConfig = (): DeserializationConfig => ({
  contentType: 'application/xml',
  deserializeTagName: name => name,
  deserializeAttribute: (tagName, name, value) => ({ [name]: value }),
});
