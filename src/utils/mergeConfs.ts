import { ValidConf } from '../types';
import { isJsonArray, isJsonObject, isJsonValue } from './utils';

export const mergeConfs = (c1: ValidConf, c2: ValidConf): ValidConf => {
  if (isJsonValue(c1)) {
    if (isJsonArray(c2)) {
      return [c1, ...c2];
    }

    return [c1, c2];
  }

  if (isJsonValue(c2)) {
    if (isJsonArray(c1)) {
      return [...c1, c2];
    }

    return [c1, c2];
  }

  if (isJsonArray(c1) && isJsonArray(c2)) {
    return [...c1, ...c2];
  }

  if (isJsonArray(c1) && isJsonObject(c2)) {
    return [...c1, c2];
  }

  if (isJsonObject(c1) && isJsonArray(c2)) {
    return [c1, ...c2];
  }

  if (isJsonObject(c1) && isJsonObject(c2)) {
    const c = { ...c1 };
    for (const k2 in c2) {
      if (!Object.prototype.hasOwnProperty.call(c1, k2)) {
        c[k2] = c2[k2];
      }
    }
    return c;
  }

  throw new Error('Unexpected config format');
};
