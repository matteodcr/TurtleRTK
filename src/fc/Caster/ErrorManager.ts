import {makeAutoObservable} from 'mobx';

export class ErrorManager {
  isError: boolean = false; // casters dont les bases sont affichées
  currentError: string = 'Unknowned error'; // casters enregistrés mais dont les bases sont pas affichées

  constructor() {
    makeAutoObservable(this);
  }

  printError(newError: string) {
    this.currentError = newError;
    this.isError = true;
  }

  modifyErrorVisibility(visible: boolean) {
    this.isError = visible;
  }

  modifyErrorContent(newError: string) {
    this.currentError = newError;
  }
}
