import {
  HastNode,
  HastElementNode,
} from './types';

const containsText = (node: HastNode): boolean => {
  if (node.type === 'text') {
    return node.value ? node.value.length > 0 : false;
  } else if (node.children && node.children.length > 0) {
    return node.children.some(containsText);
  } else {
    return false;
  }
}

export const singleLineHastFromNullableBody = (value: any): HastElementNode => {
  if (!value) {
    return {
      type: 'element',
      tagName: 'body',
      children: [],
    }
  } else {
    return value;
  }
};

export const hastToNullableBody = (bodyNode: HastNode): any => {
  return containsText(bodyNode) ? bodyNode : null;
};

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
}

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
}

export const stringToHastBody = (text: string): HastElementNode => ({
  type: 'element',
  tagName: 'body',
  children: [{
    type: 'text',
    value: text,
  }]
});
