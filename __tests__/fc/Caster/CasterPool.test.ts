import {CasterPool} from '../../../src/fc/Caster/CasterPool';
import SourceTable from '../../../src/fc/Caster/SourceTable';

import {describe, expect} from '@jest/globals';

describe('CasterPool', () => {
  let casterPool: CasterPool;

  beforeEach(() => {
    const parentStore = null;
    const subscribed: SourceTable[] = [];
    const unsubscribed: SourceTable[] = [];
    casterPool = new CasterPool(parentStore, subscribed, unsubscribed);
  });

  it('should create CasterPool object', () => {
    expect(casterPool).toBeInstanceOf(CasterPool);
  });

  it('should remove caster from subscribed', () => {
    const sourceTable: SourceTable = new SourceTable(
      casterPool,
      '127.0.0.1',
      8000,
      'username',
      'password',
      true,
    );
    casterPool.subscribed.push(sourceTable);
    casterPool.removeCaster(sourceTable);
    expect(casterPool.subscribed).not.toContain(sourceTable);
  });

  it('should remove caster from unsubscribed', () => {
    const sourceTable: SourceTable = new SourceTable(
      casterPool,
      '127.0.0.1',
      8000,
      'username',
      'password',
      true,
    );
    casterPool.unsubscribed.push(sourceTable);
    casterPool.removeCaster(sourceTable);
    expect(casterPool.unsubscribed).not.toContain(sourceTable);
  });

  it('should move caster from unsubscribed to subscribed', () => {
    const sourceTable: SourceTable = new SourceTable(
      casterPool,
      '127.0.0.1',
      8000,
      'username',
      'password',
      true,
    );
    casterPool.unsubscribed.push(sourceTable);
    casterPool.subscribe(sourceTable);
    expect(casterPool.subscribed).toContain(sourceTable);
    expect(casterPool.unsubscribed).not.toContain(sourceTable);
  });

  it('should move caster from subscribed to unsubscribed', () => {
    const sourceTable: SourceTable = new SourceTable(
      casterPool,
      '127.0.0.1',
      8000,
      'username',
      'password',
      true,
    );
    casterPool.subscribed.push(sourceTable);
    casterPool.unsubscribe(sourceTable);
    expect(casterPool.unsubscribed).toContain(sourceTable);
    expect(casterPool.subscribed).not.toContain(sourceTable);
  });
});
