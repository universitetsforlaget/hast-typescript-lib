import { HastNode, HastElementNode, HastProperties } from "./types";
import { SerializationConfig } from "./config";

const encodeUtf8Text = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const encodeUtf8AttributeValue = (text: string): string =>
  text.replace(/"/g, '&quot;');

const hastPropertiesToUtf8Attributes = (
  properties: HastProperties | undefined,
  tagName: string,
  config: SerializationConfig,
): string[] => {
  if (!properties) {
    return [];
  }

  return Object.keys(properties)
    .reduce((attributes, name) => {
      const serialized = config.serializeAttribute(tagName, name, properties[name]);
      if (!serialized) return attributes;

      if (typeof serialized === 'string') {
        return [...attributes, serialized];
      }

      const [attributeName, value] = serialized;

      if (value === 'true') {
        return [...attributes, attributeName];
      }

      return [...attributes, `${attributeName}="${encodeUtf8AttributeValue(value)}"`];
    }, [] as string[]);
};

const hastElementNodeToUtf8Markup = (
  node: HastElementNode,
  config: SerializationConfig,
): string => {
  const tagName = config.serializeTagName(node.tagName);
  if (!tagName) return '';

  const attributes = hastPropertiesToUtf8Attributes(node.properties, node.tagName, config);

  if (node.children && node.children.length > 0) {
    return `<${[tagName, ...attributes].join(' ')}>`
      + node.children.map(child => hastNodeToUtf8Markup(child, config)).join('')
      + `</${tagName}>`;
  } else {
    return `<${[tagName, ...attributes].join(' ')}/>`;
  }
};

export const hastNodeToUtf8Markup = (
  node: HastNode,
  config: SerializationConfig,
): string => {
  if (node.type === 'text') {
    return encodeUtf8Text(node.value);
  }

  if (node.tagName === 'fragment') {
    if (node.children) {
      return node.children.map(child => hastNodeToUtf8Markup(child, config)).join('');
    }
    return '';
  }

  return hastElementNodeToUtf8Markup(node, config);
};
