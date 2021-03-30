import * as assert from 'assert';

import { mergeConfs } from '../../utils/index';

suite('Merging Test Suite', () => {
  test('mergeConfs test', () => {
    assert.deepStrictEqual(mergeConfs('prim', null), ['prim', null], 'Merge two primitives');
    assert.deepStrictEqual(mergeConfs(true, [null, 1, 2]), [true, null, 1, 2], 'Merge a primitive and an array');
    assert.deepStrictEqual(mergeConfs(1, { a: 'A' }), [1, { a: 'A' }], 'Merge a primitive and an object');

    assert.deepStrictEqual(mergeConfs([{ a: 'A' }], [1, 2, false]), [{ a: 'A' }, 1, 2, false], 'Merge two arrays');
    assert.deepStrictEqual(mergeConfs([null, { a: 'A' }], 1), [null, { a: 'A' }, 1], 'Merge an array and a primitive');
    assert.deepStrictEqual(mergeConfs(['prim'], { a: 'A' }), ['prim', { a: 'A' }], 'Merge an array and an object');

    assert.deepStrictEqual(
      mergeConfs({ a: 'A', c: 'C' }, { c: 'C', d: 'D' }),
      { a: 'A', c: 'C', d: 'D' },
      'Merge two objects',
    );
    assert.deepStrictEqual(mergeConfs({ a: 'A' }, 1), [{ a: 'A' }, 1], 'Merge an object and a primitive');
    assert.deepStrictEqual(mergeConfs({ a: 'A' }, [1, 2]), [{ a: 'A' }, 1, 2], 'Merge an object and a array');
  });
});
