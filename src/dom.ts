import {
  ContentType,
  HastNode,
  HastProperties
} from './types';
import { compressElementNode } from './util';

// Hast/React compliant attribute converter
const hastPropertyOfAttr = (attrib: Attr): HastProperties => {
  const { name, nodeValue } = attrib;

  if (name === 'class') {
    return {
      className: (nodeValue || '').split(' ').filter(Boolean),
    };
  } else if (name === 'for') {
    return {
      htmlFor: nodeValue,
    };
  } else if (name.startsWith('data-') || name.startsWith('aria-')) {
    // Just convert to lower case
    return {
      [name.toLowerCase()]: nodeValue,
    };
  } else if (name.indexOf('-') >= 0) {
    // To camelCase
    const camelCased = name.replace(/-([a-z])/g, g => g[1].toUpperCase());
    return {
      [camelCased]: nodeValue
    };
  } else {
    return {
      [name]: nodeValue
    };
  }
};

export const elementToHast = (
  element: Element,
  contentType: ContentType,
): HastNode => {
  if (element.nodeType === element.TEXT_NODE) {
    return {
      type: 'text',
      value: element.nodeValue!
    }
  } else {
    let properties = {};
    for (let i = 0; i < element.attributes.length; i += 1) {
      const property = hastPropertyOfAttr(element.attributes[i]);
      properties = {
        ...properties,
        ...property,
      };
    }

    return compressElementNode({
      type: 'element',
      tagName: contentType === 'text/html' ? element.tagName.toLowerCase() : element.tagName,
      properties,
      children: nodeChildrenToHastArray(element, contentType),
    });
  }
};

export const nodeToHast = (
  node: Node,
  contentType: ContentType,
): HastNode | null => {
  if (node.nodeType === node.TEXT_NODE) {
    return node.nodeValue
      ? { type: 'text', value: node.nodeValue }
      : null;
  } else if (node.nodeType === node.ELEMENT_NODE) {
    return elementToHast(node as Element, contentType);
  }

  return null;
};

export const nodeChildrenToHastArray = (
  node: Node,
  contentType: ContentType,
): HastNode[] => {
  const hastNodes: HastNode[] = [];
  if (node.hasChildNodes()) {
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const childNode = node.childNodes[i];
      const hastNode = nodeToHast(childNode, contentType);
      if (hastNode) {
        hastNodes.push(hastNode);
      }
    }
  }
  return hastNodes;
};
