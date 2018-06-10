const child_process = require('child_process')
function Login(appLogic) {
    this.appLogic = appLogic;
    this.mainDiv = CreateElement({
        type: 'div', class: 'Login_MainDiv container center-align', elements: [
            CreateElement({ type: 'div', text: appLogic.translate("pathInput"), class: 'Login_Label' }),
            this.leaguePathInput = CreateElement({ type: 'input', class: 'Login_PathInput input-text' }),
            CreateElement({ type: 'div', text: appLogic.translate("keyInput"), class: 'Login_Label' }),
            this.keyInput = CreateElement({ type: 'input', class: 'Login_KeyInput input-text' }),
            CreateElement({ type: 'div', text: appLogic.translate("nicknameInput"), class: 'Login_Label' }),
            this.nicknameInput = CreateElement({ type: 'input', class: 'Login_NameInput input-text' }),
            CreateElement({ type: 'div', text: appLogic.translate("passwordInput"), class: 'Login_Label' }),
            this.passwordInput = CreateElement({ type: 'input', class: 'Login_PasswordInput input-text' }),
            this.loginButton = CreateElement({
                type: 'button', text: appLogic.translate("loginButton"), class: 'Login_Button waves-effect waves-light btn-large'
                , onClick: CreateFunction(this, this.loginButtonClicked)
            }),
            CreateElement({ type: 'div', text: '', class: 'Login_Label' }),
            CreateElement({ type: 'a', class: 'register', onClick: CreateFunction(this, this.registerClicked), text: appLogic.translate("registerLink") })
        ]
    });
    this.passwordInput.setAttribute("type", "password");
    var isWindows = process.platform === 'win32';
    var isMac = process.platform === 'darwin';
    if (isWindows) {
        this.leaguePathInput.placeholder = 'C:\/League-of-Legends-4-20\/';
    }
    if (isMac) {
        this.leaguePathInput.placeholder = '\/League of Legends.app';
    }

    if (localStorage.getItem("path") != undefined && localStorage.getItem("path") != "") {
        this.leaguePathInput.value = localStorage.getItem("path");
    } else {
        this.leaguePathInput.value = "C:\/League-of-Legends-4-20\/";
    }
    if (localStorage.getItem("name") != undefined && localStorage.getItem("name") != "") {
        this.nicknameInput.value = localStorage.getItem("name");
    }
    if (localStorage.getItem("password") != undefined && localStorage.getItem("password") != "") {
        this.passwordInput.value = localStorage.getItem("password");
    }
    if (localStorage.getItem("key") != undefined && localStorage.getItem("key") != "") {
        this.keyInput.value = localStorage.getItem("key");
    }
}
Login.prototype.loginButtonClicked = function () {

    this.appLogic.appData.host = "62.4.16.132";
    this.appLogic.appData.leaguePath = this.leaguePathInput.value;
    this.appLogic.appData.nickname = this.nicknameInput.value;
    this.appLogic.appData.password = this.passwordInput.value;
    this.appLogic.appData.key = this.keyInput.value;
    this.appLogic.appData.port = "7777";
    localStorage.setItem("host", "62.4.16.132");
    localStorage.setItem("path", this.leaguePathInput.value);
    localStorage.setItem("name", this.nicknameInput.value);
    localStorage.setItem("password", this.passwordInput.value);
    localStorage.setItem("port", "7777");
    localStorage.setItem("key", this.keyInput.value);

    if (this.leaguePathInput.value.length <= 0) {
        alert(appLogic.translate("errorLeaguePathLength"));
        return;
    }
    if (this.nicknameInput.value.length > 16) {
        alert(appLogic.translate("errorNicknameTooLong"));
        return;
    }
    if (this.nicknameInput.value.length <= 0) {
        alert(appLogic.translate("errorNoNickname"));
        return;
    }
    if (this.passwordInput.value.length <= 0) {
        alert(appLogic.translate("errorNoPassword"));
        return;
    }
    console.log(this.nicknameInput.value.length)
    if (!this.appLogic.appData.isPathValid()) {
        alert("Invalid League of Legends path");
        return;
    }

    this.loginButton.disabled = true;
    this.appLogic.appData.createIfNotExist();
    this.appLogic.networkManager.connectToServer();


};
Login.prototype.registerClicked = function () {
    child_process.execSync('start http://leagueofmemories.com/forum/')
}
Login.prototype.getDiv = function () {
    return this.mainDiv;
};