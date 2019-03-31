import { HastNode } from './types';
import { compressElementNode } from './util';
import { DeserializationConfig } from './config';

export const elementToHast = (
  element: Element,
  config: DeserializationConfig,
): HastNode | null => {
  if (element.nodeType === element.TEXT_NODE) {
    return {
      type: 'text',
      value: element.nodeValue!
    }
  } else {
    const tagName = config.deserializeTagName(element.tagName);
    if (!tagName) {
      return null;
    }

    let properties = {};
    for (let i = 0; i < element.attributes.length; i += 1) {
      const attr = element.attributes[i];
      const property = config.deserializeAttribute(tagName, attr.name, attr.nodeValue);
      properties = {
        ...properties,
        ...property,
      };
    }

    return compressElementNode({
      type: 'element',
      tagName,
      properties,
      children: nodeChildrenToHastArray(element, config),
    });
  }
};

export const nodeToHast = (
  node: Node,
  config: DeserializationConfig,
): HastNode | null => {
  if (node.nodeType === node.TEXT_NODE) {
    return node.nodeValue
      ? { type: 'text', value: node.nodeValue }
      : null;
  } else if (node.nodeType === node.ELEMENT_NODE) {
    return elementToHast(node as Element, config);
  }

  return null;
};

export const nodeChildrenToHastArray = (
  node: Node,
  config: DeserializationConfig,
): HastNode[] => {
  const hastNodes: HastNode[] = [];
  if (node.hasChildNodes()) {
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const childNode = node.childNodes[i];
      const hastNode = nodeToHast(childNode, config);
      if (hastNode) {
        hastNodes.push(hastNode);
      }
    }
  }
  return hastNodes;
};
