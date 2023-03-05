import SourceTable from './SourceTable';

export default class Network {
  parentSourceTable: SourceTable;
  identifier: string; // Network Identifier - Name of station network
  operator: string; // Name of institution or company operating the network
  authentification: string; // access protection for data streams None(N), Basic(B) or Digest(D)
  fee: boolean; // User fee for data access: yes (F) or no (T)
  webNet: string; // Web address for network information
  webStr: string; // Web address for stream information
  webReg: string; // Web or mail address for registration
  misc: string; //

  constructor(sourceTable: SourceTable, line: string[]) {
    if (line.length === 9) {
      this.parentSourceTable = sourceTable;
      this.identifier = line[1].trim();
      this.operator = line[2].trim();
      this.authentification = line[3].trim();
      this.fee = +line[4] === 1;
      this.webNet = line[5].trim();
      this.webStr = line[6].trim();
      this.webReg = line[7].trim();
      this.misc = line[8].trim();
    } else {
      this.parentSourceTable = sourceTable;
      this.identifier = 'TestIdentifier';
      this.operator = 'TestOperator';
      this.authentification = 'TestAuthentification';
      this.fee = false;
      this.webNet = 'TestWebNet';
      this.webStr = 'TestWebStr';
      this.webReg = 'TestWebReg';
      this.misc = 'TestWebMisc';
    }
  }
}
