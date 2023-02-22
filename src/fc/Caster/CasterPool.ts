import SourceTable from './SourceTable';

export interface CasterPoolEntry {
  sourceTable: SourceTable;
  // name: string; // get with the sourcetable and to be print on UI
  username: string;
  password: string;
}

class CasterPool {
  subscribed: Array<CasterPoolEntry>; // casters dont les bases sont affichées
  unsubscribed: Array<CasterPoolEntry>; // casters enregistrés mais dont les bases sont pas affichées

  constructor(subscribed, unsubscribed) {
    // TODO : Récupérer du cache
    // sinon
    this.subscribed = subscribed;
    this.unsubscribed = unsubscribed;
  }

  static findCaster(
    sourceTable: SourceTable,
    list: Array<CasterPoolEntry>,
  ): number {
    for (const [index, value] of list.entries()) {
      if (value.sourceTable.adress === sourceTable.adress) {
        return index;
      }
    }
    return -1;
  }

  addCaster(sourceTable: SourceTable, username: string, password: string) {
    if (
      CasterPool.findCaster(sourceTable, this.subscribed) === -1 &&
      CasterPool.findCaster(sourceTable, this.unsubscribed) === -1
    ) {
      this.subscribed.push({
        sourceTable,
        username,
        password,
      });
      return;
    }
    throw new Error('Caster déja dans la liste.');
  }
  removeCaster(sourceTable: SourceTable) {
    let index = CasterPool.findCaster(sourceTable, this.subscribed);
    if (index !== -1) {
      this.subscribed.splice(index);
    }
    index = CasterPool.findCaster(sourceTable, this.unsubscribed);
    if (index !== -1) {
      this.unsubscribed.splice(index, 1);
    }
  }

  subscribe(sourceTable: SourceTable) {
    const index = this.unsubscribed.findIndex(
      entry => entry.sourceTable === sourceTable,
    );
    if (index !== -1) {
      const [entry] = this.unsubscribed.splice(index, 1);
      this.subscribed.push(entry);
      return;
    }
    throw new Error('Caster pas unsubscribed');
  }
  unsubscribe(sourceTable: SourceTable) {
    const index = this.subscribed.findIndex(
      entry => entry.sourceTable === sourceTable,
    );
    if (index !== -1) {
      const [entry] = this.subscribed.splice(index, 1);
      this.unsubscribed.push(entry);
      return;
    }
    throw new Error('Caster pas subscribed');
  }
}

export default CasterPool;
