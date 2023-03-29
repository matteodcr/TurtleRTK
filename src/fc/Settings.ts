export default class Settings {
    darkTheme: boolean;
    bigFontEnabled: boolean;


    constructor() {
        this.darkTheme = false;
        this.bigFontEnabled = true;
      }

    changeTheme() {
        if (this.darkTheme) {
            this.darkTheme = false;
        }
        else {
            this.darkTheme = true;
        }
    }

    changeFontSize() {
        if (this.bigFontEnabled) {
            this.bigFontEnabled = false;
        }
        else {
            this.bigFontEnabled = true;
        }
    }
}
