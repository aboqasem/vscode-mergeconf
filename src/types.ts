export type JsonValue = null | boolean | number | string;

export type JsonArray = Array<Json>;

export type JsonObject = { [name: string]: Json };

export type Json = JsonValue | JsonArray | JsonObject;

export type ValidConf = Json;
