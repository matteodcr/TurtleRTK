import {makeAutoObservable, runInAction} from 'mobx';
import RNFS, {ReadDirItem, StatResult} from 'react-native-fs';

export interface FileInfos {
  content: string | null;
  infos: StatResult | null;
}
export default class LogManager {
  logList: ReadDirItem[] = [];
  root = RNFS.ExternalDirectoryPath;
  recordingPath = this.root + '/recordings';
  currentFile: FileInfos = {
    content: null,
    infos: null,
  };
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.write('first');
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
    const extension = '.record';

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

  modifyInfo(infos: StatResult) {
    this.currentFile.infos = infos;
  }

  getFile(path: string) {
    runInAction(() => RNFS.readFile(path))
      .then(content => {
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
