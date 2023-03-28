import {makeAutoObservable} from 'mobx';

/**
 * Manage the SnackBar component in App.tsx
 */
export class ErrorManager {
  isError: boolean = false;
  currentError: string = 'Unknowned error';

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Modify the error message and show the SnackBar
   * @param newError - is the error to print
   */
  printError(newError: string) {
    this.currentError = newError;
    this.isError = true;
  }

  /**
   * Modify the error visibility
   * @param visible - indicate if the SnackBar should be visibile or not
   */
  modifyErrorVisibility(visible: boolean) {
    this.isError = visible;
  }

  /**
   * Modify the error content
   * @param newError - is the error to print
   */
  modifyErrorContent(newError: string) {
    this.currentError = newError;
  }
}
