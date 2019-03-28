import {
  HastNode,
  HastBodyNode,
} from './types';

export const stripHastDebug = (node: HastNode): HastNode => {
  if (node.type === 'text') {
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

/** Remove all unnecessary properties from hast document */
export const compressHast = (node: HastNode): HastNode => {
  if (node.type === 'text') {
    return node;
  }

  return {
    type: 'element',
    tagName: node.tagName,
    ...node.properties && Object.keys(node.properties).length && { properties: node.properties },
    ...node.children && node.children.length && { children: node.children.map(compressHast) },
  };
};
