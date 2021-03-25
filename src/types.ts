export type JsonArray = Array<Json>;

export type JsonObject = { [name: string]: Json };

export type Json = null | boolean | number | string | JsonArray | JsonObject;

export type ValidConf = Json;
