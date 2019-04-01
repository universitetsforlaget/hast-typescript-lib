import { HastNode, HastProperties } from "./types";
import { isElement } from "./util";
import {
  hastPropertyToMarkup,
  markupAttributeToHastProperty,
  htmlSpace,
  xmlSpace,
} from "./properties";

export interface SerializationConfig {
  isFragment: (node: HastNode) => boolean;
  serializeTagName: (name: string) => string | null;
  serializeAttribute: (
    tagName: string,
    name: string,
    value: any
  ) => [string, string] | string | null;
};

export interface DeserializationConfig {
  deserializeTagName: (name: string) => string | null;
  deserializeAttribute: (
    tagName: string,
    name: string,
    value: string | null
  ) => HastProperties;
};

export const html5SerializationConfig = (): SerializationConfig => ({
  isFragment: node => isElement(node) && node.tagName === 'fragment',
  serializeTagName: name => name,
  serializeAttribute: (tagName, name, value) => hastPropertyToMarkup(htmlSpace, name, value),
});

export const html5DeserializationConfig = (): DeserializationConfig => ({
  deserializeTagName: name => name.toLowerCase(),
  deserializeAttribute: (tagName, name, value) => markupAttributeToHastProperty(htmlSpace, name, value),
});

export const xmlSerializationConfig = (): SerializationConfig => ({
  isFragment: node => false,
  serializeTagName: name => name,
  serializeAttribute: (tagName, name, value) => hastPropertyToMarkup(xmlSpace, name, value),
});

export const xmlDeserializationConfig = (): DeserializationConfig => ({
  deserializeTagName: name => name,
  deserializeAttribute: (tagName, name, value) => markupAttributeToHastProperty(xmlSpace, name, value),

});
