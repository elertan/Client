function MainPage(appLogic) {
    this.appLogic = appLogic;
    this.selectedSkin = 0;
    this.mainDiv = CreateElement({
        type: 'div', class: 'MainPage_MainDiv row', elements: [
            CreateElement({
                type: 'div', class: 'MainPage_LeftSideContainer', elements: [
                    this.onlineBoxDiv = CreateElement({ type: 'div', class: 'MainPage_OnlineBoxDiv' }),
                    this.newsBoxDiv = CreateElement({ type: 'div', class: 'MainPage_NewsBoxDiv' })
                ]
            }),
            this.championDiv = CreateElement({
                type: 'div', class: 'MainPage_LobbyDiv', elements:
                    [
                        this.lobbyContainer = CreateElement({
                            type: 'div', class: 'MainPage_LobbyContainer', id: 'LobbyContainer', elements: [
                                this.championDiv = CreateElement({
                                    type: 'div', class: 'MainPage_ChampionDiv row', elements: [
                                        this.championSelectDiv = CreateElement({
                                            type: 'div', class: 'MainPage_ChampionSelectDiv col s10', elements:
                                                [
                                                    this.championSelect = CreateElement({ type: 'select', id: 'championSelect', class: 'MainPage_ChampionSelect icons' }),
                                                ]
                                        }),
                                        this.skinSelectDiv = CreateElement({ type: 'button', id: 'selectSkin', class: 'MainPage_ButtonSelectSkin btn col s2', text: appLogic.translate("selectSkin") }),
                                        this.modalSkin = CreateElement({
                                            type: 'div', id: 'modalSkin', class: 'modal modal-fixed-footer', elements: [
                                                this.modalSkinContent = CreateElement({
                                                    type: 'div', class: 'modal-content', elements: [
                                                        CreateElement({ type: 'h4', class: 'center-align', text: appLogic.translate("selectYourSkin") }),
                                                        this.carouselSkin = CreateElement({ type: 'div', class: 'carousel' })
                                                    ]
                                                }),
                                                this.modalSkinFooter = CreateElement({
                                                    type: 'div', class: 'modal-footer center-align', elements: [
                                                        CreateElement({ type: 'button', class: 'modal-action modal-close waves-effect waves-green btn', text: 'Accept' })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                this.lobbyPog = (this.lobbyPage = new CDNdownloader(this.appLogic)).getDiv()
                            ]
                        }),
                    ]
            }),

        ]
    });
    for (var i = 0; i < ChampionList.length; i++) {
        var element = CreateElement({ type: 'option', class: 'left circle', value: ChampionList[i], text: ChampionList[i], appendTo: this.championSelect });
        element.setAttribute('data-icon', 'http://ddragon.leagueoflegends.com/cdn/4.20.1/img/champion/' + ChampionList[i] + '.png');
    }

    this.championSelect.value = "Ezreal";

    /*this.blockingOverlay = CreateElement({type: 'div', class: 'MainPage_BlockOverlay', text: 'Game Console', elements: [
        this.startingGameDiv = CreateElement({type: 'div', class: 'MainPage_StartingGame'}),
        this.exitGameButton = CreateElement({type: 'button', class: 'MainPage_StartingGame_ExitButton',
        text: "Exit Console Screen", onClick: CreateFunction(this, this.setBlockOverlayOff)})
    ]});*/

    this.updateOnlineList();
    this.updateNewsList();
}
MainPage.prototype.changeToLobbyView = function (yeah) {
    if (yeah == true) {
        var parent = document.getElementById("LobbyContainer");
        parent.removeChild(this.lobbyPog);
        this.lobbyPog = (this.lobbyPage = new LobbyPage(this.appLogic)).getDiv();
        parent.appendChild(this.lobbyPog);
        //document.body.appendChild(newChild);
    }
}
MainPage.prototype.addServerLog = function (text) {
    var oldHeight = this.startingGameDiv.scrollHeight;
    window.requestAnimationFrame(CreateFunction(this, function () {
        this.startingGameDiv.innerText += text;
        var newHeight = this.startingGameDiv.scrollHeight;
        this.startingGameDiv.scrollTop += newHeight - oldHeight;
    }));
};
MainPage.prototype.setBlockOverlayOn = function () {
    this.startingGameDiv.innerText = "";
    //this.mainDiv.appendChild(this.blockingOverlay);
};
MainPage.prototype.setBlockOverlayOff = function () {
    this.blockingOverlay.remove();
};

MainPage.prototype.championSelectChange = function () {
    var champion = this.championSelect.value;
    this.selectedSkin = 0;
    this.appLogic.networkManager.sendChampionSelectChange(champion);
    this.skinChange();
    while (this.carouselSkin.hasChildNodes()) {
        this.carouselSkin.removeChild(this.carouselSkin.lastChild);
    }
    for (var i = 0; i < ExtendedChampionsData[this.championSelect.value].skins.length; i++) {
        var element = CreateElement({
            type: 'a', id: 'skin' + i, class: 'carousel-item skin' + (i == 0 ? ' MainPage_ActiveSkin' : ''), elements: [
                CreateElement({ type: 'img', src: 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/' + this.championSelect.value + '_' + ExtendedChampionsData[this.championSelect.value].skins[i].num + '.jpg' }),
                CreateElement({ type: 'div', class: 'center-align', text: ExtendedChampionsData[this.championSelect.value].skins[i].name })
            ], appendTo: this.carouselSkin
        });
        element.setAttribute('skin', i);
        let mainPage = this;
        $("#skin" + i).click(function () {
            $(".skin").removeClass('MainPage_ActiveSkin');
            $("#skin" + $(this).attr('skin')).addClass('MainPage_ActiveSkin');
            mainPage.selectedSkin = $(this).attr('skin');
            mainPage.skinChange();
        });
    }
    this.carouselSkin.setAttribute('class', 'carousel');
    /*$('.carousel').carousel({ dist: -30 });
    $('.carousel').carousel('set', 0);*/
};

MainPage.prototype.skinChange = function () {
    console.log('Change skin to ' + this.selectedSkin);
    this.appLogic.networkManager.sendSkinSelectChange(this.selectedSkin);
};

MainPage.prototype.chatInputKeyDown = function (e) {
    if (e.keyCode == 13) {
        this.appLogic.networkManager.sendChat(this.chatBoxInput.value);
        this.chatBoxInput.value = "";
    }
};

MainPage.prototype.addToChat = function (chat) {
    var oldHeight = this.chatBoxDiv.scrollHeight;
    this.chatBoxDiv.innerText += chat + '\n';
    window.requestAnimationFrame(CreateFunction(this, function () {
        var newHeight = this.chatBoxDiv.scrollHeight;
        this.chatBoxDiv.scrollTop += newHeight - oldHeight;
    }));
};

MainPage.prototype.updateOnlineList = function () {
    while (this.onlineBoxDiv.hasChildNodes()) {
        this.onlineBoxDiv.removeChild(this.onlineBoxDiv.lastChild);
    }
    this.onlineBoxDiv.appendChild(
        CreateElement({
            type: 'div', class: 'MainPage_OnlinePlayerDiv', elements: [
                CreateElement({ type: 'div', class: 'MainPage_OnlinePlayerNameDiv', text: this.appLogic.translate("onlinePlayers") + ': ' + this.appLogic.networkManager.onlinePlayers.length }),
                this.onlinePlayersCollection = CreateElement({ type: 'ul', class: 'collection' })
            ]
        })
    );
    for (var i = 0; i < this.appLogic.networkManager.onlinePlayers.length; i++) {
        var player = this.appLogic.networkManager.onlinePlayers[i];
        var playerDiv = CreateElement({
            type: 'li', class: 'MainPage_OnlinePlayerDiv collection-item avatar', elements: [
                CreateElement({ type: 'img', src: 'http://ddragon.leagueoflegends.com/cdn/4.20.1/img/champion/' + player.selectedChampion + '.png', class: 'champion-frame' }),
                CreateElement({ type: 'span', class: 'title blue-grey-text truncate', text: player.nickname }),
                CreateElement({ type: 'p', class: ' blue-grey-text text-lighten-4', text: player.id + " | " + player.rank })
            ]
        });
        this.onlinePlayersCollection.appendChild(playerDiv);
    }
};

MainPage.prototype.updateNewsList = function () {
    while (this.newsBoxDiv.hasChildNodes()) {
        this.newsBoxDiv.removeChild(this.newsBoxDiv.lastChild);
    }
    this.newsBoxDiv.appendChild(
        CreateElement({
            type: 'div', class: 'MainPage_OnlinePlayerDiv', elements: [
                CreateElement({ type: 'div', class: 'MainPage_OnlinePlayerNameDiv', text: this.appLogic.translate("news") + ': ' }),
                this.newsCollection = CreateElement({ type: 'ul', class: 'collection' })
            ]
        })
    );
    var playerDiv = CreateElement({
        type: 'li', class: 'MainPage_OnlinePlayerDiv collection-item avatar', elements: [
            CreateElement({ type: 'img', src: 'http://ddragon.leagueoflegends.com/cdn/4.20.1/img/champion/' + 'Gnar' + '.png', class: 'champion-frame' }),
            CreateElement({ type: 'span', class: 'title blue-grey-text truncate', text: "Skins are disabled" }),
            CreateElement({ type: 'p', class: ' blue-grey-text text-lighten-4', text: "We've taken the decision to disable Skins. The goal of this project is to bring back the old League of Legends experience, but not to steal the business to Riot Games. Also, we expect to bring the custom skins support during this month" })
        ]
    });
    this.newsCollection.appendChild(playerDiv);

};

MainPage.prototype.getDiv = function () {
    return this.mainDiv;
};

var ChampionList = [
    "Blitzcrank",
    "Caitlyn",
    "Evelynn",
    "Ezreal",
    "Graves",
    "MissFortune",
    "Lucian",
    "Lulu",
    "Vayne"
]
var ExtendedChampionsData = {
    "Aatrox": {
        "id": 266,
        "title": "the Darkin Blade",
        "name": "Aatrox",
        "skins": [
           
        ],
        "key": "Aatrox"
    },
    "Thresh": {
        "id": 412,
        "title": "the Chain Warden",
        "name": "Thresh",
        "skins": [
            
        ],
        "key": "Thresh"
    },
    "Tryndamere": {
        "id": 23,
        "title": "the Barbarian King",
        "name": "Tryndamere",
        "skins": [
           
        ],
        "key": "Tryndamere"
    },
    "Gragas": {
        "id": 79,
        "title": "the Rabble Rouser",
        "name": "Gragas",
        "skins": [
            
        ],
        "key": "Gragas"
    },
    "Cassiopeia": {
        "id": 69,
        "title": "the Serpent's Embrace",
        "name": "Cassiopeia",
        "skins": [
           
        ],
        "key": "Cassiopeia"
    },
    "Ryze": {
        "id": 13,
        "title": "the Rogue Mage",
        "name": "Ryze",
        "skins": [
        ],
        "key": "Ryze"
    },
    "Poppy": {
        "id": 78,
        "title": "the Iron Ambassador",
        "name": "Poppy",
        "skins": [
        ],
        "key": "Poppy"
    },
    "Sion": {
        "id": 14,
        "title": "The Undead Juggernaut",
        "name": "Sion",
        "skins": [
        ],
        "key": "Sion"
    },
    "Annie": {
        "id": 1,
        "title": "the Dark Child",
        "name": "Annie",
        "skins": [
        ],
        "key": "Annie"
    },
    "Karma": {
        "id": 43,
        "title": "the Enlightened One",
        "name": "Karma",
        "skins": [
        ],
        "key": "Karma"
    },
    "Nautilus": {
        "id": 111,
        "title": "the Titan of the Depths",
        "name": "Nautilus",
        "skins": [
        ],
        "key": "Nautilus"
    },
    "Lux": {
        "id": 99,
        "title": "the Lady of Luminosity",
        "name": "Lux",
        "skins": [
        ],
        "key": "Lux"
    },
    "Ahri": {
        "id": 103,
        "title": "the Nine-Tailed Fox",
        "name": "Ahri",
        "skins": [
        ],
        "key": "Ahri"
    },
    "Olaf": {
        "id": 2,
        "title": "the Berserker",
        "name": "Olaf",
        "skins": [
        ],
        "key": "Olaf"
    },
    "Viktor": {
        "id": 112,
        "title": "the Machine Herald",
        "name": "Viktor",
        "skins": [
        ],
        "key": "Viktor"
    },
    "Anivia": {
        "id": 34,
        "title": "the Cryophoenix",
        "name": "Anivia",
        "skins": [
        ],
        "key": "Anivia"
    },
    "Singed": {
        "id": 27,
        "title": "the Mad Chemist",
        "name": "Singed",
        "skins": [
        ],
        "key": "Singed"
    },
    "Garen": {
        "id": 86,
        "title": "The Might of Demacia",
        "name": "Garen",
        "skins": [
        ],
        "key": "Garen"
    },
    "Lissandra": {
        "id": 127,
        "title": "the Ice Witch",
        "name": "Lissandra",
        "skins": [
        ],
        "key": "Lissandra"
    },
    "Maokai": {
        "id": 57,
        "title": "the Twisted Treant",
        "name": "Maokai",
        "skins": [
        ],
        "key": "Maokai"
    },
    "Morgana": {
        "id": 25,
        "title": "Fallen Angel",
        "name": "Morgana",
        "skins": [
        ],
        "key": "Morgana"
    },
    "Evelynn": {
        "id": 28,
        "title": "the Widowmaker",
        "name": "Evelynn",
        "skins": [
        ],
        "key": "Evelynn"
    },
    "Fizz": {
        "id": 105,
        "title": "the Tidal Trickster",
        "name": "Fizz",
        "skins": [
        ],
        "key": "Fizz"
    },
    "Heimerdinger": {
        "id": 74,
        "title": "the Revered Inventor",
        "name": "Heimerdinger",
        "skins": [
        ],
        "key": "Heimerdinger"
    },
    "Zed": {
        "id": 238,
        "title": "the Master of Shadows",
        "name": "Zed",
        "skins": [
        ],
        "key": "Zed"
    },
    "Rumble": {
        "id": 68,
        "title": "the Mechanized Menace",
        "name": "Rumble",
        "skins": [
        ],
        "key": "Rumble"
    },
    "Mordekaiser": {
        "id": 82,
        "title": "the Master of Metal",
        "name": "Mordekaiser",
        "skins": [
        ],
        "key": "Mordekaiser"
    },
    "Sona": {
        "id": 37,
        "title": "Maven of the Strings",
        "name": "Sona",
        "skins": [
        ],
        "key": "Sona"
    },
    "KogMaw": {
        "id": 96,
        "title": "the Mouth of the Abyss",
        "name": "Kog'Maw",
        "skins": [
        ],
        "key": "KogMaw"
    },
    "Katarina": {
        "id": 55,
        "title": "the Sinister Blade",
        "name": "Katarina",
        "skins": [
        ],
        "key": "Katarina"
    },
    "Lulu": {
        "id": 117,
        "title": "the Fae Sorceress",
        "name": "Lulu",
        "skins": [
        ],
        "key": "Lulu"
    },
    "Ashe": {
        "id": 22,
        "title": "the Frost Archer",
        "name": "Ashe",
        "skins": [
        ],
        "key": "Ashe"
    },
    "Karthus": {
        "id": 30,
        "title": "the Deathsinger",
        "name": "Karthus",
        "skins": [
        ],
        "key": "Karthus"
    },
    "Alistar": {
        "id": 12,
        "title": "the Minotaur",
        "name": "Alistar",
        "skins": [
        ],
        "key": "Alistar"
    },
    "Darius": {
        "id": 122,
        "title": "the Hand of Noxus",
        "name": "Darius",
        "skins": [
        ],
        "key": "Darius"
    },
    "Vayne": {
        "id": 67,
        "title": "the Night Hunter",
        "name": "Vayne",
        "skins": [
        ],
        "key": "Vayne"
    },
    "Udyr": {
        "id": 77,
        "title": "the Spirit Walker",
        "name": "Udyr",
        "skins": [
        ],
        "key": "Udyr"
    },
    "Varus": {
        "id": 110,
        "title": "the Arrow of Retribution",
        "name": "Varus",
        "skins": [
        ],
        "key": "Varus"
    },
    "Leona": {
        "id": 89,
        "title": "the Radiant Dawn",
        "name": "Leona",
        "skins": [
        ],
        "key": "Leona"
    },
    "Jayce": {
        "id": 126,
        "title": "the Defender of Tomorrow",
        "name": "Jayce",
        "skins": [
        ],
        "key": "Jayce"
    },
    "Syndra": {
        "id": 134,
        "title": "the Dark Sovereign",
        "name": "Syndra",
        "skins": [
        ],
        "key": "Syndra"
    },
    "Pantheon": {
        "id": 80,
        "title": "the Artisan of War",
        "name": "Pantheon",
        "skins": [
        ],
        "key": "Pantheon"
    },
    "Riven": {
        "id": 92,
        "title": "the Exile",
        "name": "Riven",
        "skins": [
        ],
        "key": "Riven"
    },
    "Khazix": {
        "id": 121,
        "title": "the Voidreaver",
        "name": "Kha'Zix",
        "skins": [
        ],
        "key": "Khazix"
    },
    "Corki": {
        "id": 42,
        "title": "the Daring Bombardier",
        "name": "Corki",
        "skins": [
        ],
        "key": "Corki"
    },
    "Azir": {
        "id": 268,
        "title": "the Emperor of the Sands",
        "name": "Azir",
        "skins": [
        ],
        "key": "Azir"
    },
    "Caitlyn": {
        "id": 51,
        "title": "the Sheriff of Piltover",
        "name": "Caitlyn",
        "skins": [
        ],
        "key": "Caitlyn"
    },
    "Nidalee": {
        "id": 76,
        "title": "the Bestial Huntress",
        "name": "Nidalee",
        "skins": [
        ],
        "key": "Nidalee"
    },
    "Kennen": {
        "id": 85,
        "title": "the Heart of the Tempest",
        "name": "Kennen",
        "skins": [
        ],
        "key": "Kennen"
    },
    "Galio": {
        "id": 3,
        "title": "the Sentinel's Sorrow",
        "name": "Galio",
        "skins": [
        ],
        "key": "Galio"
    },
    "Veigar": {
        "id": 45,
        "title": "the Tiny Master of Evil",
        "name": "Veigar",
        "skins": [
        ],
        "key": "Veigar"
    },
    "Gnar": {
        "id": 150,
        "title": "the Missing Link",
        "name": "Gnar",
        "skins": [
        ],
        "key": "Gnar"
    },
    "Malzahar": {
        "id": 90,
        "title": "the Prophet of the Void",
        "name": "Malzahar",
        "skins": [
        ],
        "key": "Malzahar"
    },
    "Graves": {
        "id": 104,
        "title": "the Outlaw",
        "name": "Graves",
        "skins": [
        ],
        "key": "Graves"
    },
    "Vi": {
        "id": 254,
        "title": "the Piltover Enforcer",
        "name": "Vi",
        "skins": [
        ],
        "key": "Vi"
    },
    "Kayle": {
        "id": 10,
        "title": "The Judicator",
        "name": "Kayle",
        "skins": [
        ],
        "key": "Kayle"
    },
    "Irelia": {
        "id": 39,
        "title": "the Will of the Blades",
        "name": "Irelia",
        "skins": [
        ],
        "key": "Irelia"
    },
    "LeeSin": {
        "id": 64,
        "title": "the Blind Monk",
        "name": "Lee Sin",
        "skins": [
        ],
        "key": "LeeSin"
    },
    "Elise": {
        "id": 60,
        "title": "The Spider Queen",
        "name": "Elise",
        "skins": [
        ],
        "key": "Elise"
    },
    "Volibear": {
        "id": 106,
        "title": "the Thunder's Roar",
        "name": "Volibear",
        "skins": [
        ],
        "key": "Volibear"
    },
    "Nunu": {
        "id": 20,
        "title": "the Yeti Rider",
        "name": "Nunu",
        "skins": [
        ],
        "key": "Nunu"
    },
    "TwistedFate": {
        "id": 4,
        "title": "the Card Master",
        "name": "Twisted Fate",
        "skins": [
        ],
        "key": "TwistedFate"
    },
    "Jax": {
        "id": 24,
        "title": "Grandmaster at Arms",
        "name": "Jax",
        "skins": [
        ],
        "key": "Jax"
    },
    "Shyvana": {
        "id": 102,
        "title": "the Half-Dragon",
        "name": "Shyvana",
        "skins": [
        ],
        "key": "Shyvana"
    },
    "Kalista": {
        "id": 429,
        "title": "the Spear of Vengeance",
        "name": "Kalista",
        "skins": [
        ],
        "key": "Kalista"
    },
    "DrMundo": {
        "id": 36,
        "title": "the Madman of Zaun",
        "name": "Dr. Mundo",
        "skins": [
        ],
        "key": "DrMundo"
    },
    "Diana": {
        "id": 131,
        "title": "Scorn of the Moon",
        "name": "Diana",
        "skins": [
        ],
        "key": "Diana"
    },
    "Brand": {
        "id": 63,
        "title": "the Burning Vengeance",
        "name": "Brand",
        "skins": [
        ],
        "key": "Brand"
    },
    "Sejuani": {
        "id": 113,
        "title": "the Winter's Wrath",
        "name": "Sejuani",
        "skins": [
        ],
        "key": "Sejuani"
    },
    "Vladimir": {
        "id": 8,
        "title": "the Crimson Reaper",
        "name": "Vladimir",
        "skins": [
        ],
        "key": "Vladimir"
    },
    "Zac": {
        "id": 154,
        "title": "the Secret Weapon",
        "name": "Zac",
        "skins": [
        ],
        "key": "Zac"
    },
    "Quinn": {
        "id": 133,
        "title": "Demacia's Wings",
        "name": "Quinn",
        "skins": [
        ],
        "key": "Quinn"
    },
    "Akali": {
        "id": 84,
        "title": "the Fist of Shadow",
        "name": "Akali",
        "skins": [
        ],
        "key": "Akali"
    },
    "Tristana": {
        "id": 18,
        "title": "the Megling Gunner",
        "name": "Tristana",
        "skins": [
        ],
        "key": "Tristana"
    },
    "Hecarim": {
        "id": 120,
        "title": "the Shadow of War",
        "name": "Hecarim",
        "skins": [
        ],
        "key": "Hecarim"
    },
    "Sivir": {
        "id": 15,
        "title": "the Battle Mistress",
        "name": "Sivir",
        "skins": [
        ],
        "key": "Sivir"
    },
    "Lucian": {
        "id": 236,
        "title": "the Purifier",
        "name": "Lucian",
        "skins": [
        ],
        "key": "Lucian"
    },
    "Rengar": {
        "id": 107,
        "title": "the Pridestalker",
        "name": "Rengar",
        "skins": [
        ],
        "key": "Rengar"
    },
    "Warwick": {
        "id": 19,
        "title": "the Blood Hunter",
        "name": "Warwick",
        "skins": [
        ],
        "key": "Warwick"
    },
    "Skarner": {
        "id": 72,
        "title": "the Crystal Vanguard",
        "name": "Skarner",
        "skins": [
        ],
        "key": "Skarner"
    },
    "Malphite": {
        "id": 54,
        "title": "Shard of the Monolith",
        "name": "Malphite",
        "skins": [
        ],
        "key": "Yasuo"
    },
    "Xerath": {
        "id": 101,
        "title": "the Magus Ascendant",
        "name": "Xerath",
        "skins": [
        ],
        "key": "Teemo"
    },
    "Nasus": {
        "id": 75,
        "title": "the Curator of the Sands",
        "name": "Nasus",
        "skins": [
        ],
        "key": "Nasus"
    },
    "Renekton": {
        "id": 58,
        "title": "the Butcher of the Sands",
        "name": "Renekton",
        "skins": [
        ],
        "key": "Renekton"
    },
    "Draven": {
        "id": 119,
        "title": "the Glorious Executioner",
        "name": "Draven",
        "skins": [
        ],
        "key": "Draven"
    },
    "Shaco": {
        "id": 35,
        "title": "the Demon Jester",
        "name": "Shaco",
        "skins": [
        ],
        "key": "Shaco"
    },
    "Swain": {
        "id": 50,
        "title": "the Master Tactician",
        "name": "Swain",
        "skins": [
        ],
        "key": "Talon"
    },
    "Janna": {
        "id": 40,
        "title": "the Storm's Fury",
        "name": "Janna",
        "skins": [
        ],
        "key": "Janna"
    },
    "Ziggs": {
        "id": 115,
        "title": "the Hexplosives Expert",
        "name": "Ziggs",
        "skins": [
        ],
        "key": "Ziggs"
    },
    "Orianna": {
        "id": 61,
        "title": "the Lady of Clockwork",
        "name": "Orianna",
        "skins": [
        ],
        "key": "Orianna"
    },
    "Fiora": {
        "id": 114,
        "title": "the Grand Duelist",
        "name": "Fiora",
        "skins": [
        ],
        "key": "Fiora"
    },
    "FiddleSticks": {
        "id": 9,
        "title": "the Harbinger of Doom",
        "name": "Fiddlesticks",
        "skins": [
        ],
        "key": "FiddleSticks"
    },
    "Chogath": {
        "id": 31,
        "title": "the Terror of the Void",
        "name": "Cho'Gath",
        "skins": [
        ],
        "key": "Chogath"
    },
    "Rammus": {
        "id": 33,
        "title": "the Armordillo",
        "name": "Rammus",
        "skins": [
        ],
        "key": "Rammus"
    },
    "Leblanc": {
        "id": 7,
        "title": "the Deceiver",
        "name": "LeBlanc",
        "skins": [
        ],
        "key": "Leblanc"
    },
    "Soraka": {
        "id": 16,
        "title": "the Starchild",
        "name": "Soraka",
        "skins": [
        ],
        "key": "Soraka"
    },
    "Zilean": {
        "id": 26,
        "title": "the Chronokeeper",
        "name": "Zilean",
        "skins": [
        ],
        "key": "Zilean"
    },
    "Nocturne": {
        "id": 56,
        "title": "the Eternal Nightmare",
        "name": "Nocturne",
        "skins": [
        ],
        "key": "Nocturne"
    },
    "Jinx": {
        "id": 222,
        "title": "the Loose Cannon",
        "name": "Jinx",
        "skins": [
        ],
        "key": "Jinx"
    },
    "Yorick": {
        "id": 83,
        "title": "the Gravedigger",
        "name": "Yorick",
        "skins": [
        ],
        "key": "Yorick"
    },
    "Urgot": {
        "id": 6,
        "title": "the Headsman's Pride",
        "name": "Urgot",
        "skins": [
        ],
        "key": "Urgot"
    },
    "MissFortune": {
        "id": 21,
        "title": "the Bounty Hunter",
        "name": "Miss Fortune",
        "skins": [
        ],
        "key": "MissFortune"
    },
    "MonkeyKing": {
        "id": 62,
        "title": "the Monkey King",
        "name": "Wukong",
        "skins": [
        ],
        "key": "MonkeyKing"
    },
    "Blitzcrank": {
        "id": 53,
        "title": "the Great Steam Golem",
        "name": "Blitzcrank",
        "skins": [
        ],
        "key": "Blitzcrank"
    },
    "Shen": {
        "id": 98,
        "title": "Eye of Twilight",
        "name": "Shen",
        "skins": [
        ],
        "key": "Shen"
    },
    "Braum": {
        "id": 201,
        "title": "the Heart of the Freljord",
        "name": "Braum",
        "skins": [
        ],
        "key": "Braum"
    },
    "XinZhao": {
        "id": 5,
        "title": "the Seneschal of Demacia",
        "name": "Xin Zhao",
        "skins": [
        ],
        "key": "XinZhao"
    },
    "Twitch": {
        "id": 29,
        "title": "the Plague Rat",
        "name": "Twitch",
        "skins": [
        ],
        "key": "Twitch"
    },
    "MasterYi": {
        "id": 11,
        "title": "the Wuju Bladesman",
        "name": "Master Yi",
        "skins": [
        ],
        "key": "MasterYi"
    },
    "Taric": {
        "id": 44,
        "title": "the Gem Knight",
        "name": "Taric",
        "skins": [
        ],
        "key": "Taric"
    },
    "Amumu": {
        "id": 32,
        "title": "the Sad Mummy",
        "name": "Amumu",
        "skins": [
        ],
        "key": "Amumu"
    },
    "Gangplank": {
        "id": 41,
        "title": "the Saltwater Scourge",
        "name": "Gangplank",
        "skins": [
        ],
        "key": "Gangplank"
    },
    "Trundle": {
        "id": 48,
        "title": "the Troll King",
        "name": "Trundle",
        "skins": [
        ],
        "key": "Trundle"
    },
    "Kassadin": {
        "id": 38,
        "title": "the Void Walker",
        "name": "Kassadin",
        "skins": [
        ],
        "key": "Kassadin"
    },
    "Velkoz": {
        "id": 161,
        "title": "the Eye of the Void",
        "name": "Vel'Koz",
        "skins": [
        ],
        "key": "Velkoz"
    },
    "Zyra": {
        "id": 143,
        "title": "Rise of the Thorns",
        "name": "Zyra",
        "skins": [
        ],
        "key": "Zyra"
    },
    "Nami": {
        "id": 267,
        "title": "the Tidecaller",
        "name": "Nami",
        "skins": [
        ],
        "key": "Nami"
    },
    "JarvanIV": {
        "id": 59,
        "title": "the Exemplar of Demacia",
        "name": "Jarvan IV",
        "skins": [
        ],
        "key": "JarvanIV"
    },
    "Ezreal": {
        "id": 81,
        "title": "the Prodigal Explorer",
        "name": "Ezreal",
        "skins": [
        ],
        "key": "Ezreal"
    }
}