export type ContentType = 'text/html' | 'application/xml';

export interface SerializationConfig {
  contentType: ContentType;
  serializeTagName: (name: string) => string | null;
  serializeAttributeName: (name: string) => string | null;
};

export interface DeserializationConfig {
  contentType: ContentType;
  deserializeTagName: (name: string) => string | null;
  deserializeAttributeName: (name: string) => string | null;
};

export const html5SerializationConfig = (): SerializationConfig => ({
  contentType: 'text/html',
  serializeTagName: name => name,
  serializeAttributeName: name => name,
});

export const html5DeserializationConfig = (): DeserializationConfig => ({
  contentType: 'text/html',
  deserializeTagName: name => name.toLowerCase(),
  deserializeAttributeName: name => name,
});

export const xmlSerializationConfig = (): SerializationConfig => ({
  contentType: 'application/xml',
  serializeTagName: name => name,
  serializeAttributeName: name => name,
});

export const xmlDeserializationConfig = (): DeserializationConfig => ({
  contentType: 'application/xml',
  deserializeTagName: name => name,
  deserializeAttributeName: name => name,
});
