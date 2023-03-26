import {makeAutoObservable} from 'mobx';
import RNFS, {ReadDirItem} from 'react-native-fs';
export default class LogManager {
  logList: ReadDirItem[] = [];
  root = RNFS.ExternalDirectoryPath;
  recordingPath = this.root + '/recordings';

  constructor() {
    makeAutoObservable(this);
  }

  generateFileName() {
    const now = new Date();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString();
    const extension = '.record';

    return `${hour}h${minutes}-${day}-${month}-${year}${extension}`;
  }

  findDirectory(path: string) {
    var items: ReadDirItem[] = this.scan(path);
    for (let i = 0; i < items.length; i++) {
      console.log(items[i]);
      if (items[i].name === 'recordings' && items[i].isDirectory()) {
        return true;
      }
    }
    return false;
  }

  handleRecordingDirectory() {
    if (!this.findDirectory(this.recordingPath)) {
      RNFS.mkdir(this.recordingPath).then(() =>
        console.log(this.recordingPath + ' GENERATED'),
      );
    }
  }

  write(content: string) {
    RNFS.writeFile(
      this.recordingPath + '/' + this.generateFileName(),
      content,
      'utf8',
    )
      .then(() => {
        console.log('FILE WRITTEN!');
      })
      .catch(err => {
        console.log(err.message);
      });
  }
  scan(path: string): ReadDirItem[] {
    RNFS.readDir(path).then(result => {
      console.log(path);
      console.log('GOT RESULT', result);
      return result;
    });
    return [];
  }

  getLogs(): ReadDirItem[] {
    return this.scan(this.recordingPath);
  }
}
