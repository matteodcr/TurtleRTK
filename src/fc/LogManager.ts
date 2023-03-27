import {makeAutoObservable, runInAction} from 'mobx';
import RNFS, {ReadDirItem, StatResult} from 'react-native-fs';

export interface FileInfos {
  content: string;
  infos: StatResult | null;
}

function hasNonPrintableChars(str: string): boolean {
  const regex = /[^\x20-\x7E]/g;
  return regex.test(str);
}

function removeEmptyLines(input: string): string {
  const lines = input.split('\n'); // Diviser la chaîne en tableau de lignes
  const output: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '') {
      // Vérifier si la ligne n'est pas vide
      output.push(lines[i]); // Ajouter la ligne à la sortie
    }
  }

  return output.join('\n'); // Rejoindre le tableau de lignes en une chaîne et renvoyer
}
export default class LogManager {
  logList: ReadDirItem[] = [];
  root = RNFS.ExternalDirectoryPath;
  recordingPath = this.root + '/recordings';
  currentFile: FileInfos = {
    content: 'null',
    infos: null,
  };
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLogList(list: ReadDirItem[]) {
    this.logList = list;
  }

  generateFileName() {
    const now = new Date();
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString();
    const extension = '.ubx';

    return `${year}-${month}-${day}-${hour}${minutes}${seconds}${extension}`;
  }

  getFileName(filePath: string | undefined): string {
    if (filePath === undefined) {
      return '.record';
    }
    const pathArray = filePath.split('/');
    return pathArray[pathArray.length - 1];
  }

  findDirectory(path: string) {
    var items: ReadDirItem[] = this.scan(path);
    for (let i = 0; i < items.length; i++) {
      if (items[i].name === 'recordings' && items[i].isDirectory()) {
        return true;
      }
    }
    return false;
  }

  handleRecordingDirectory() {
    if (!this.findDirectory(this.recordingPath)) {
      RNFS.mkdir(this.recordingPath);
    }
  }

  write(content: string) {
    RNFS.writeFile(
      this.recordingPath + '/' + this.generateFileName(),
      content,
      'utf8',
    )
      .then(() => {
        // console.log('FILE WRITTEN!');
      })
      .catch(err => {
        console.log(err.message);
      });
    this.getLogs();
  }

  delete(path: string) {
    RNFS.unlink(path)
      .then(() => {
        // console.log('FILE DELETED');
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch(err => {
        // console.log(err.message);
      });
  }
  scan(path: string): ReadDirItem[] {
    RNFS.readDir(path).then(result => {
      return result;
    });
    return [];
  }

  modifyContent(content: string) {
    this.currentFile.content = content;
  }

  getClearContent(): string {
    const lines = this.currentFile.content.split('\n'); // séparer les lignes par saut de ligne

    const validChars = /^[a-zA-Z0-9, $*.]+$/;

    const filteredLines = lines.filter(line => {
      return validChars.test(line.trim());
    });

    return filteredLines.join('\n');
  }

  modifyInfo(infos: StatResult) {
    this.currentFile.infos = infos;
  }

  getFile(path: string) {
    runInAction(() => RNFS.readFile(path))
      .then((content: string) => {
        this.modifyContent(content);
      })
      .then(() => RNFS.stat(path))
      .then(infos => {
        this.modifyInfo(infos);
      });
  }

  getLogs() {
    RNFS.readDir(this.recordingPath).then(result => {
      this.setLogList(result);
    });
  }
}
