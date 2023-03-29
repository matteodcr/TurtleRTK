import waitForEvent from 'wait-for-event-promise';
import {makeAutoObservable} from 'mobx';

import Base from './Base';
import Network from './Network';
import Caster from './Caster';
import {CasterPool} from './CasterPool';
import {NtripClientV1} from './NTRIP/v1/clientV1';
import {NtripClientV2} from './NTRIP/v2/clientV2';

export const FAKE_MOUNTPOINT = '';
export const ENDSOURCETABLE = 'ENDSOURCETABLE';
export const SOURCETABLE_LINE_SEPARATOR = '\n';
export const STREAM_IDENTIFIER = 'STR';
export const NETWORK_IDENTIFIER = 'NET';
export const CASTER_IDENTIFIER = 'CAS';
export const CSV_SEPARATOR = ';';

/**
 * All the entries of a source table
 */
export type SourceTableEntries = {
  baseList: Array<Base>;
  networkList: Array<Network>;
  casterList: Array<Caster>;
};

/**
 * Represent all the data we have on a caster
 */
export default class SourceTable {
  parentCasterPool: CasterPool;
  entries: SourceTableEntries;
  adress: string;
  port: number;
  username: string;
  password: string;
  isNTRIPv1: boolean = true;

  constructor(
    parent: CasterPool,
    adress: string,
    port: number,
    username: string,
    password: string,
    isNTRIPv1: boolean,
  ) {
    this.parentCasterPool = parent;
    this.adress = adress;
    this.port = port;
    this.username = username;
    this.password = password;
    this.isNTRIPv1 = isNTRIPv1;
    makeAutoObservable(this);
  }

  /**
   * Make a NTRIP source table request, get, parse the response and fill the class
   * @param adress - is the adress of the caster
   * @param port - is the port of the caster
   * @param username - is your username
   * @param password - is your password
   */
  async getSourceTable(
    adress?: string,
    port?: number,
    username?: string,
    password?: string,
  ) {
    let rawSourceTable = '';
    if (adress == null) {
      adress = this.adress;
    }
    if (port == null) {
      port = 2101;
    }
    if (username == null) {
      username = 'test@test.com'; // like rtk2go logs
    }
    if (password == null) {
      password = 'none';
    }
    try {
      const connectionOptions = {
        host: adress,
        port: port,
        mountpoint: FAKE_MOUNTPOINT,
        username: username,
        password: password,
        userAgent: 'NTRIP',
        xyz: [-1983430.2365, -4937492.4088, 3505683.7925],
        interval: 2000,
      };

      let client: NtripClientV1 | NtripClientV2 = new NtripClientV1(
        connectionOptions,
      );
      if (!this.isNTRIPv1) {
        client = new NtripClientV2(connectionOptions);
      }

      const rawSourceTablePromise = waitForEvent(client, 'response'); // used to convert an event into a promise

      client.on('data', data => {
        rawSourceTable =
          rawSourceTable + data.toString() + SOURCETABLE_LINE_SEPARATOR;
        if (data.toString().indexOf(ENDSOURCETABLE) !== -1) {
          client.emit('response', rawSourceTable);
          if (client.client != null) {
            client.client.end();
          }
          client.close();
        }
      });

      client.on('response', data => {
        data;
      });

      client.on('error', err => {
        console.log('ERROR-DETECTED: ' + err);
        client.close();
        if (this.parentCasterPool?.parentStore?.errorManager !== null) {
          this.parentCasterPool?.parentStore?.errorManager.printError(
            String(err),
          );
          this.parentCasterPool.setTyping(false);
          this.parentCasterPool.setLoading(false);
        }
      });

      client._connect();
      this.entries = this.parseSourceTable(await rawSourceTablePromise);
    } catch (error) {
      console.error(error);
      throw new Error('Impossible to get the Source Table');
    }
  }

  /**
   * Parse a raw NTRIP source table
   * @param rawSourceTable - is the NTRIP response
   */
  parseSourceTable(rawSourceTable: string) {
    const entries: SourceTableEntries = {
      baseList: [],
      casterList: [],
      networkList: [],
    };

    const lines = rawSourceTable.split(SOURCETABLE_LINE_SEPARATOR);
    let firstLine: number = -1;
    let lastLine: number = -1;
    for (let i = 0; i < lines.length; i++) {
      if (this.isSourceTableEntry(lines[i]) && firstLine === -1) {
        firstLine = i;
      } else if (lines[i] === ENDSOURCETABLE) {
        lastLine = i;
        //TODO: save in cache
        break;
      }
      if (lastLine === -1 && firstLine !== -1 && this.isCasterEntry(lines[i])) {
        entries.casterList.push(
          new Caster(this, lines[i].split(CSV_SEPARATOR)),
        );
      } else if (
        lastLine === -1 &&
        firstLine !== -1 &&
        this.isNetworkEntry(lines[i])
      ) {
        entries.networkList.push(
          new Network(this, lines[i].split(CSV_SEPARATOR)),
        );
      } else if (
        lastLine === -1 &&
        firstLine !== -1 &&
        this.isStreamEntry(lines[i])
      ) {
        entries.baseList.push(new Base(this, lines[i].split(CSV_SEPARATOR)));
      } else {
        //TODO: handle unparsable lines
      }
    }
    return entries;
  }

  /**
   * Check if line is a caster entry
   * @param line - is the source table entry
   */
  isCasterEntry(line: string): boolean {
    return line.startsWith(CASTER_IDENTIFIER);
  }

  /**
   * Check if line is a network entry
   * @param line - is the source table entry
   */
  isNetworkEntry(line: string): boolean {
    return line.startsWith(NETWORK_IDENTIFIER);
  }

  /**
   * Check if line is a stream entry
   * @param line - is the source table entry
   */
  isStreamEntry(line: string): boolean {
    return line.startsWith(STREAM_IDENTIFIER);
  }

  /**
   * Check if line is a source table entry
   * @param line - is the source table entry
   */
  isSourceTableEntry(line: string): boolean {
    return (
      this.isCasterEntry(line) ||
      this.isNetworkEntry(line) ||
      this.isStreamEntry(line)
    );
  }

  /**
   * Build a fake source table
   */
  getMockSourceTable() {
    this.entries = {
      baseList: [],
      casterList: [],
      networkList: [],
    };
    for (let i = 0; i < 5; i++) {
      this.entries.networkList.push(new Network(this, []));
      this.entries.baseList.push(new Base(this, []));
      this.entries.casterList.push(new Caster(this, []));
    }
  }
}
