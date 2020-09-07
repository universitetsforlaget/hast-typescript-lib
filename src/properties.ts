import { HastProperties } from './types';

const info = require('property-information');

export type InfoSpace = any;

// See https://github.com/wooorm/property-information#readme
interface PropertyInfo {
  space: string;
  attribute: string;
  property: string;
  boolean?: boolean;
  booleanish?: boolean;
  overloadedBoolean?: boolean;
  number?: boolean;
  spaceSeparated?: boolean;
  commaSeparated?: boolean;
  commaOrSpaceSeparated?: boolean;
  mustUseProperty?: boolean;
  defined?: boolean;
}

export const htmlSpace: InfoSpace = info.html;
export const xmlSpace: InfoSpace = info.xml;

const findPropertyInfo = (infoSpace: InfoSpace, propertyOrAttr: string): PropertyInfo | null =>
  info.find(infoSpace, propertyOrAttr) || null;

const hastPropertyToJs = (
  infoSpace: InfoSpace,
  property: string,
  value: any
): { [property: string]: any } => {
  if (property.startsWith('data-') && infoSpace === htmlSpace) {
    return { [property]: value };
  }

  const info = findPropertyInfo(infoSpace, property);
  if (!info) return {};

  if (info.spaceSeparated || info.commaOrSpaceSeparated) {
    return { [property]: value.join(' ') };
  } else if (info.commaSeparated) {
    return { [property]: value.join(', ') };
  }

  return { [property]: value };
};

export const hastPropertyToMarkup = (
  infoSpace: InfoSpace,
  property: string,
  value: any
): [string, string] | string | null => {
  if (property.startsWith('data-') && infoSpace === htmlSpace) {
    return [property, value];
  }

  const info = findPropertyInfo(infoSpace, property);
  if (!info) return null;

  const { attribute } = info;

  if (info.boolean || info.overloadedBoolean) {
    return value ? attribute : null;
  }
  if (info.spaceSeparated || info.commaOrSpaceSeparated) {
    return [attribute, typeof value === 'string' ? value : value.join(' ')];
  }
  if (info.commaSeparated) {
    return [attribute, typeof value === 'string' ? value : value.join(', ')];
  }

  return [attribute, `${value}`];
};

export const markupAttributeToHastProperty = (
  infoSpace: InfoSpace,
  attribute: string,
  value: any
): HastProperties => {
  if (attribute.startsWith('data-') && infoSpace === htmlSpace) {
    return { [attribute]: value };
  }

  const info = findPropertyInfo(infoSpace, attribute);
  if (!info) return {};

  const { property } = info;

  if (info.boolean || info.overloadedBoolean) {
    return { [property]: true };
  }
  if (info.booleanish) {
    return { [property]: value.toLowerCase().includes('false') ? false : true };
  }
  if (info.spaceSeparated) {
    return { [property]: value.split(/[\s]+/) };
  }
  if (info.commaSeparated) {
    return { [property]: value.split(/[,]/).map((str: string) => str.trim()) };
  }
  if (info.commaOrSpaceSeparated) {
    return { [property]: value.split(/[\s,]+/) };
  }

  return { [property]: value };
};

export const hastPropertiesToJs = (
  infoSpace: InfoSpace,
  properties?: HastProperties
): { [property: string]: any } | null => {
  if (!properties) return null;

  return Object.keys(properties).reduce(
    (agg, property) => ({
      ...agg,
      ...hastPropertyToJs(infoSpace, property, properties[property]),
    }),
    {}
  );
};
