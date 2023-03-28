export default class Settings {
    darkTheme: boolean;


    constructor() {
        this.darkTheme = true;
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
