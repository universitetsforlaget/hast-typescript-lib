import {
  ContentType,
  HastNode,
  HastProperties
} from './types';
import { compressElementNode } from './util';

const hastPropertyOfAttr = (attrib: Attr): HastProperties => {
  switch (attrib.name) {
    case 'class':
      return {
        className: (attrib.nodeValue || '').split(' ').filter(Boolean),
      };
    default:
      return {
        [attrib.name]: attrib.nodeValue
      };
  }
}

export const hastOfElement = (
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
      children: hastChildrenOfNode(element, contentType),
    });
  }
}

export const hastChildrenOfNode = (
  node: Node,
  contentType: ContentType,
): HastNode[] => {
  const hastNodes: HastNode[] = [];
  if (node.hasChildNodes()) {
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const childNode = node.childNodes[i];
      const hastNode = hastOfElement(childNode as Element, contentType);
      hastNodes.push(hastNode);
    }
  }
  return hastNodes;
};
