import { HastNode, HastElementNode, HastProperties } from "./types";

const encodeUtf8Text = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const encodeUtf8AttributeValue = (text: string): string =>
  text.replace(/"/g, '&quot;');

const hastPropertiesToUtf8Attributes = (properties?: HastProperties): string[] => {
  if (!properties) {
    return [];
  }

  return Object.keys(properties)
    .map(key => `${key}="${encodeUtf8AttributeValue(properties[key])}"`);
};

const hastElementNodeToUtf8Markup = (node: HastElementNode): string => {
  const attributes = hastPropertiesToUtf8Attributes(node.properties);
  if (node.children && node.children.length > 0) {
    return `<${[node.tagName, ...attributes].join(' ')}>${node.children.map(hastNodeToUtf8Markup).join('')}</${node.tagName}>`;
  } else {
    return `<${[node.tagName, ...attributes].join(' ')}/>`;
  }
};

export const hastNodeToUtf8Markup = (node: HastNode): string => {
  if (node.type === 'text') {
    return encodeUtf8Text(node.value);
  }

  return hastElementNodeToUtf8Markup(node);
};
