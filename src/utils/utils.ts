import { JsonArray, JsonObject, JsonValue } from '../types';

export const isJsonValue = (arg: any): arg is JsonValue => {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string';
};

export const isJsonArray = (arg: any): arg is JsonArray => {
  return Array.isArray(arg);
};

export const isJsonObject = (arg: any): arg is JsonObject => {
  return typeof arg === 'object' && !Array.isArray(arg);
};
