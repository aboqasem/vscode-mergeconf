type JsonArray = Array<Json>;

type JsonObject = { [name: string]: Json };

type Json = null | boolean | number | string | JsonArray | JsonObject;

export type ValidConf = Json;
