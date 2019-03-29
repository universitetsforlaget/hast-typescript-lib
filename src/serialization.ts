import { HastNode, HastElementNode, HastProperties } from "./types";

const encodeUtf8Text = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;');
}

const encodeUtf8AttributeValue = (text: string): string => {
  return text
    .replace(/"/g, '&quot;');
}

const hastPropertiesToUtf8Attributes = (properties?: HastProperties): string => {
  if (!properties) {
    return '';
  }

  return Object.keys(properties)
    .map(key => `${key}="${encodeUtf8AttributeValue(properties[key])}"`)
    .join(' ');
}

const hastElementNodeToUtf8Markup = (node: HastElementNode): string => {
  const attributes = hastPropertiesToUtf8Attributes(node.properties);
  if (node.children && node.children.length > 0) {
    return `<${node.tagName} ${attributes}>${node.children.map(hastNodeToUtf8Markup).join('')}</${node.tagName}>`;
  } else {
    return `<${node.tagName} ${attributes}/>`;
  }
}

export const hastNodeToUtf8Markup = (node: HastNode): string => {
  if (node.type === 'text') {
    return encodeUtf8Text(node.value);
  }

  return hastElementNodeToUtf8Markup(node);
};
