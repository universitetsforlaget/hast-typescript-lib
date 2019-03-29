import {
  HastProperties,
  HastNode,
  HastElementNode,
  HastBodyNode,
  HastTextNode,
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

export const compressBodyNode = (node: HastBodyNode): HastBodyNode => {
  return {
    ...node,
    ...compressChildren(node.children),
  };
};

export const compressElementNode = (node: HastElementNode): HastElementNode => {
  return {
    ...node,
    ...compressProperties(node.properties),
    ...compressChildren(node.children),
  };
};

export const compressNode = (node: HastNode): HastNode => {
  if (node.type === 'text') {
    return node;
  }

  return compressElementNode(node);
};


/** Remove all unnecessary properties from hast document */
export const compressDocument = (node: HastNode): HastNode => {
  if (node.type === 'text') {
    return node;
  }

  return {
    ...node,
    ...compressProperties(node.properties),
    ...node.children && compressChildren(node.children.map(compressDocument)),
  };
};

export const compressDocumentBody = (node: HastBodyNode): HastBodyNode => {
  return {
    type: 'element',
    tagName: 'body',
    ...compressChildren(node.children),
  };
};
