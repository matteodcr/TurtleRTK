import {makeAutoObservable, runInAction} from 'mobx';
import RNFS, {ReadDirItem, StatResult} from 'react-native-fs';

export interface FileInfos {
  content: string; // content of the file
  infos: StatResult | null; // related stats about the file
}

/**
 * Manage .ubx file saving and reading
 */
export default class LogManager {
  logList: ReadDirItem[] = []; // all files in /recordings
  root = RNFS.ExternalDirectoryPath; // the root of the app directory
  recordingPath = this.root + '/recordings'; // the path to /recording directory
  currentFile: FileInfos = {
    content: 'null',
    infos: null,
  };

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Modify the list of .ubx files in /recordings
   * @param list - is the log list to set
   */
  setLogList(list: ReadDirItem[]) {
    this.logList = list;
  }

  /**
   * Generate a generic file name with the current date
   */
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

  /**
   * Get the file name from a filepath
   * @param filePath - is the path of the file
   * @return the file name
   */
  getFileName(filePath: string | undefined): string {
    if (filePath === undefined) {
      return '.record';
    }
    const pathArray = filePath.split('/');
    return pathArray[pathArray.length - 1];
  }

  /**
   * Check if /recordings exist in path
   * @param path - the path where we want to search ./recordings
   */
  findDirectory(path: string) {
    var items: ReadDirItem[] = this.scan(path);
    for (let i = 0; i < items.length; i++) {
      if (items[i].name === 'recordings' && items[i].isDirectory()) {
        return true;
      }
    }
    return false;
  }

  /**
   * If /recordings does not exist, we create one
   */
  handleRecordingDirectory() {
    if (!this.findDirectory(this.recordingPath)) {
      RNFS.mkdir(this.recordingPath);
    }
  }

  /**
   * Write a file with content in
   * @param content - is the content we want to fill the file with
   */
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

  /**
   * Delete the file located to path
   * @param path - is the path of the file we want to delete
   */
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

  /**
   * Return all the items in path
   * @param path - is the path we want to scan
   */
  scan(path: string): ReadDirItem[] {
    RNFS.readDir(path).then(result => {
      return result;
    });
    return [];
  }

  /**
   * Modify the content of the file we want to read
   * @param content - is the new content
   */
  modifyContent(content: string) {
    this.currentFile.content = content;
  }

  /**
   * Modify the infos of the file we want to read
   * @param infos - is the new infos
   */
  modifyInfo(infos: StatResult) {
    this.currentFile.infos = infos;
  }

  /**
   * Replace unprintable strings with <Binary data> to put in a <Text> component
   * @return the modified string
   */
  getClearContent(): string {
    let output: string = '';
    let binaryDataAdded = false;

    this.currentFile.content.split('\n').forEach((line: string) => {
      if (/^[A-Za-z0-9$*,.\s\t]*$/.test(line)) {
        output += line + '\n';
        binaryDataAdded = false;
      } else if (!binaryDataAdded) {
        output += '<Binary data>\n';
        binaryDataAdded = true;
      }
    });
    return output.trim();
  }

  /**
   * Get the content of the file located in path
   * @param path - is the file path
   */
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

  /**
   * Get all the files in ./directory
   */
  getLogs() {
    RNFS.readDir(this.recordingPath).then(result => {
      this.setLogList(result);
    });
  }
}
