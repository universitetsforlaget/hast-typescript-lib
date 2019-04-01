import {
  HastProperties,
  HastNode,
  HastTextNode,
  HastElementNode,
  HastFragmentNode,
} from './types';

export const isText = (node: HastNode): node is HastTextNode =>
  node.type === 'text';

export const isElement = (node: HastNode): node is HastElementNode =>
  node.type === 'element';

export const hasClass = (node: HastElementNode, className: string): boolean =>
  node.properties
  && node.properties.className
  && node.properties.className.some(name => name === className)
  || false;

export const stripHastDebug = (node: HastNode): HastNode => {
  if (isText(node)) {
    return node;
  }

  const properties = node.properties && Object.keys(node.properties).reduce((agg, key) => {
    if (key !== '__source') {
      return {
        ...agg,
        [key]: node.properties![key],
      }
    }
    return agg;
  }, {});

  return {
    ...node,
    ...node.children && { children: node.children.map(stripHastDebug) },
    ...properties && { properties },
  };
};

export const compressChildren = (children?: HastNode[]): { children?: HastNode[]} => {
  return {
    ...children && children.length > 0 && { children }
  };
}

export const compressProperties = (properties?: HastProperties): { properties?: HastProperties }  => {
  return {
    ...properties && Object.keys(properties).length && { properties },
  };
}

export const compressFragmentNode = (node: HastFragmentNode): HastFragmentNode => {
  return {
    type: 'element',
    tagName: 'fragment',
    ...compressChildren(node.children),
  };
};

export const compressElementNode = (node: HastElementNode): HastElementNode => {
  return {
    type: 'element',
    tagName: node.tagName,
    ...compressProperties(node.properties),
    ...compressChildren(node.children),
  };
};

export const compressNode = (node: HastNode): HastNode => {
  if (isText(node)) return node;

  return compressElementNode(node);
};

/** Remove all unnecessary properties from hast document */
export const compressDocument = (node: HastNode): HastNode => {
  if (isText(node)) return node;

  return {
    ...node,
    ...compressProperties(node.properties),
    ...node.children && compressChildren(node.children.map(compressDocument)),
  };
};
