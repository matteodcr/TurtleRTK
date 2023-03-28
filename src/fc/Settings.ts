export default class Settings {
    darkTheme: boolean;


    constructor() {
        this.darkTheme = false;
      }

    changeTheme() {
        if (this.darkTheme) {
            this.darkTheme = false;
        }
        else {
            this.darkTheme = true;
        }
    }
}
