import {makeAutoObservable, runInAction} from 'mobx';

import SourceTable from './SourceTable';
import {AppStore} from '../Store';

/**
 * Manage two lists of SourceTable
 */
export class CasterPool {
  parentStore: AppStore | null = null;
  subscribed: Array<SourceTable> = []; // active casters
  unsubscribed: Array<SourceTable> = []; // saved casters
  isLoading: boolean = false;
  isTyping: boolean = false;
  isNTRIPv1: boolean = true;

  constructor(
    parentStore: AppStore | null,
    subscribed: SourceTable[],
    unsubscribed: SourceTable[],
  ) {
    this.parentStore = parentStore;
    this.subscribed = subscribed;
    this.unsubscribed = unsubscribed;
    makeAutoObservable(this);
  }

  /**
   * Define the protocol wanted by the user.
   * @param isNTRIPv1 - true if NTRIPv1 / false if NTRIPv2
   */
  setProtocol(isNTRIPv1: boolean) {
    this.isNTRIPv1 = isNTRIPv1;
  }

  /**
   * Set the app status to typing
   * @param typing - true if the user is in the caster form, else false
   */
  setTyping(typing: boolean) {
    this.isTyping = typing;
  }

  /**
   * Set the app status to loading
   * @param loading - true if the user is waiting for loading the sourcetable, else false
   */
  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  /**
   * Search a SourceTable in the list
   * @param sourceTable - The item to find
   * @param list - Where to search
   * @return the index if sourceTable is in list else -1
   */
  findCaster(sourceTable: SourceTable, list: SourceTable[]): number {
    for (const [index, value] of list.entries()) {
      if (value.adress === sourceTable.adress) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Load the sourceTable from the NTRIP caster and add it to subscribed
   * @param sourceTable - the sourceTable to fill in with entries and add
   */
  addCaster(sourceTable: SourceTable) {
    if (
      this.findCaster(sourceTable, this.subscribed) === -1 &&
      this.findCaster(sourceTable, this.unsubscribed) === -1
    ) {
      this.setLoading(true);
      sourceTable
        .getSourceTable(
          sourceTable.adress,
          sourceTable.port,
          sourceTable.username,
          sourceTable.password,
        )
        .then(() => runInAction(() => this.subscribed.push(sourceTable)))
        .then(() => this.setLoading(false))
        .then(() => this.setTyping(false));
      return;
    }
    throw new Error('This caster is already added.');
  }

  /**
   * Delete sourceTable from subscribded and unsubscribed
   * @param sourceTable - the source table to delete from CasterPool
   */
  removeCaster(sourceTable: SourceTable) {
    let index = this.findCaster(sourceTable, this.subscribed);
    if (index !== -1) {
      this.subscribed.splice(index);
    }
    index = this.findCaster(sourceTable, this.unsubscribed);
    if (index !== -1) {
      this.unsubscribed.splice(index, 1);
    }
  }

  /**
   * Move sourceTable to subscribed list
   * @param sourceTable - the source table to move to subscribed
   */
  subscribe(sourceTable: SourceTable) {
    const index = this.unsubscribed.findIndex(entry => entry === sourceTable);
    if (index !== -1) {
      const [entry] = this.unsubscribed.splice(index, 1);
      this.subscribed.push(entry);
      return;
    }
    throw new Error('Caster pas unsubscribed');
  }

  /**
   * Move sourceTable to unsubscribed list
   * @param sourceTable - the source table to move to unsubscribed
   */
  unsubscribe(sourceTable: SourceTable) {
    const index = this.subscribed.findIndex(entry => entry === sourceTable);
    if (index !== -1) {
      const [entry] = this.subscribed.splice(index, 1);
      this.unsubscribed.push(entry);
      return;
    }
    throw new Error('Caster pas subscribed');
  }

  /**
   * Format data to match with the SectionList expectations
   */
  get formatData() {
    return [
      {
        title: 'Active casters',
        data: this.subscribed.slice(),
      },
      {
        title: 'Saved casters',
        data: this.unsubscribed.slice(),
      },
    ];
  }
}
