class Atlas {
    constructor() {
        // Constants
        this.models = {
            male: '5Ac8',
            female: '5Ac9'
        }

        // DOM Elements
        this.maleBtn = document.getElementById('male-btn');
        this.femaleBtn = document.getElementById('female-btn');
        this.googleBtnEl = document.getElementById('google-btn');
        this.wikipediaBtnEl = document.getElementById('wikipedia-btn');
        this.physiotherapistBtnEl = document.getElementById('physiotherapist-btn');
        this.panelGoogleEl = document.getElementById('google');
        this.panelWikipediaEl = document.getElementById('wikipedia');
        this.panelPhysiotherapistEl = document.getElementById('physiotherapist');
        this.stretchBtnEl = document.getElementById('stretch-btn');
        this.strengtheningBtnEl = document.getElementById('strengthening-btn');
        this.enBtnEl = document.getElementById('en-btn');
        this.ruBtnEl = document.getElementById('ru-btn');
        this.headerLabelEl = document.querySelector('#muscle-name');
        this.physiotherapistFrameEl = document.querySelector('#physiotherapist iframe');
        this.wikipediaFrameEl = document.querySelector('#wikipedia iframe');

        // State
        this.muscle = {
            ru: {
                label: '',
                wiki: ''
            },
            en: {
                label: '',
                wiki: ''
            },
            kenhub: '',
            physiotherapist: ''
        };
        this.human = new HumanAPI('human');
        this.currentGoogleSuggestion = '';
        this.language = 'ru';

        // Panel elements mapping
        this.elements = {
            google: {
                button: this.googleBtnEl,
                panel: this.panelGoogleEl
            },
            wikipedia: {
                button: this.wikipediaBtnEl,
                panel: this.panelWikipediaEl
            },
            physiotherapist: {
                button: this.physiotherapistBtnEl,
                panel: this.panelPhysiotherapistEl
            }
        };

        // Button text translations
        this.buttonsText = {
            male: {
                ru: '🧔🏻‍♂️ Мужчина',
                en: '🧔🏻‍♂️ Male',
            },
            female: {
                ru: '👩🏼 Женщина',
                en: '👩🏼 Female',
            },
            stretch: {
                ru: '🤸‍♀️ Растяжка',
                en: '🤸‍♀️ Stretch',
            },
            strengthening: {
                ru: '🏋️ Укрепление',
                en: '🏋️ Strengthening',
            }
        };

        // Wiki URLs
        this.initWikiUrls = {
            ru: 'Мышечная_система',
            en: 'Muscular_system'
        };

        // Bind methods to this instance
        this.onClickMuscle = this.onClickMuscle.bind(this);
    }

    async onClickMuscle(muscleId) {
        console.log('scene.objectsSelected event: ', muscleId);
        let eventName;
        let eventStatus;
        Object.entries(muscleId).forEach(([key, value]) => {
            eventName = key;
            eventStatus = value;
        });

        if(eventStatus) {
            const muscleName = eventName.replaceAll(/(human_17|_male_|_female_|muscular_system-|left_|right_|_ID)/g, '');

            const res = await fetch('./data/muscles/' + muscleName + '.json');
            this.muscle = await res.json();

            // Временная история для отсутствующих мышц
            if(!this.muscle[this.language].label) {
                // Этой мышцы пока нет в базе, выберите другую
            }


            this.setGoogleQuery();
            this.setWikipediaSrc();
            this.setHeaderLabel();
            this.setPhysiotherapist();
        } else {
            this.clearGoogleResults();
        }
    }

    initHuman(modelId) {
        const bioDigitalPath = 'https://human.biodigital.com/widget/?be=' + this.models[modelId] + '&ui-tour=false&ui-info=false&ui-fullscreen=false&ui-share=false&uaid=' + this.models[modelId];
        document.getElementById('human').src = bioDigitalPath;
        this.human = new HumanAPI('human');

        this.maleBtn.classList.remove('active');
        this.femaleBtn.classList.remove('active');
        if(modelId === 'male') {
            this.maleBtn.classList.add('active');
        }
        if(modelId === 'female') {
            this.femaleBtn.classList.add('active');
        }

        const objectID = [];
        const objectName = [];
        this.human.send('scene.info', (data) => {
            const sceneObjects = data.objects;
            // console.log(sceneObjects.filter(obj => obj.available))
            let available = 0;
            let noAvailable = 0;
            //get list of object names and IDs
            for (var objectId in sceneObjects) {
                var object = sceneObjects[objectId];
                var id = object.objectId;
                var name = object.name;
                if(object.available) {
                    objectID.push(id);
                    objectName.push(name);
                    available++;
                } else {
                    noAvailable++;
                }
            }
            console.log('available', available);
            console.log('noAvailable', noAvailable);
            console.log('objectName', objectName);
            console.log('objectID', objectID);
            // create display list of object names
            // var table = document.getElementById('list');
            // for(var i = 0; i < objectName.length; i++){
            //     var row = table.insertRow(i);
            //     var cell = row.insertCell(0);
            //     cell.innerHTML = objectName[i];
            // }
        });
        this.human.on('scene.objectsSelected', this.onClickMuscle);
    }

    // Panel management
    setPanel(name) {
        this.allHide();
        this.toggleElement(name, true);
    }

    allHide() {
        this.toggleElement('google', false);
        this.toggleElement('wikipedia', false);
        this.toggleElement('physiotherapist', false);
    }

    toggleElement(name, visible) {
        if(visible) {
            this.elements[name].button.classList.add('active');
            this.elements[name].panel.classList.remove('hidden');
        }
        else {
            this.elements[name].button.classList.remove('active');
            this.elements[name].panel.classList.add('hidden');
        }
    }

    // Google functionality
    setGoogleSuggestion(name) {
        this.currentGoogleSuggestion = name;
        if (name === 'stretch') {
            this.stretchBtnEl.classList.add('active');
            this.strengtheningBtnEl.classList.remove('active');
        }
        if (name === 'strengthening') {
            this.strengtheningBtnEl.classList.add('active');
            this.stretchBtnEl.classList.remove('active');
        }
        this.setGoogleQuery();
    }

    setGoogleQuery() {
        const googleSearchInput = google.search.cse.element.getElement('storesearch');
        const suggestionText = this.buttonsText[this.currentGoogleSuggestion] ?
            this.buttonsText[this.currentGoogleSuggestion][this.language].replace(/[^a-zA-Zа-яА-Я]*/, '') : '';
        googleSearchInput.execute(suggestionText + ' ' + this.muscle[this.language].label);
    }

    clearGoogleResults() {
        const googleSearchInput = google.search.cse.element.getElement('storesearch');
        googleSearchInput.clearAllResults();
    }

    // Language functionality
    setLanguage(lang) {
        this.language = lang;
        this.setButtonsTexts();
        if(this.muscle[this.language].wiki) {
            this.setWikipediaSrc();
        }
		else {
	        this.setWikipediaSrc();
			this.wikipediaBtnEl.classList.add('hidden');
	        this.setPanel('google');
        }
        if(this.muscle[this.language].label) {
            this.setGoogleQuery();
            this.setHeaderLabel();
        }
        if(this.language === 'ru') {
            this.ruBtnEl.classList.add('active');
            this.enBtnEl.classList.remove('active');
        }
        if(this.language === 'en') {
            this.enBtnEl.classList.add('active');
            this.ruBtnEl.classList.remove('active');
        }
    }

    // Title and Buttons
    setHeaderLabel() {
        this.headerLabelEl.innerHTML = this.muscle[this.language].label;
    }

    setButtonsTexts() {
        this.stretchBtnEl.innerHTML = this.buttonsText.stretch[this.language];
        this.strengtheningBtnEl.innerHTML = this.buttonsText.strengthening[this.language];
        this.maleBtn.innerHTML = this.buttonsText.male[this.language];
        this.femaleBtn.innerHTML = this.buttonsText.female[this.language];
    }

    // Physiotherapist functionality
    setPhysiotherapist() {
        const musclePhysiotherapist = this.muscle.physiotherapist;
        if(musclePhysiotherapist) {
            this.physiotherapistFrameEl.src = 'https://physiotherapist.ru/muscles/' + musclePhysiotherapist;
            this.physiotherapistBtnEl.classList.remove('hidden');
        }
        else {
            this.physiotherapistBtnEl.classList.add('hidden');
            this.setPanel('google');
        }
    }

    // Wiki functionality
    setWikipediaSrc() {
        const muscleWiki = this.muscle[this.language].wiki;
        if(muscleWiki) {
            this.wikipediaFrameEl.src = 'https://' + this.language + '.m.wikipedia.org/wiki/' + muscleWiki;
            this.wikipediaBtnEl.classList.remove('hidden');
        }
        else {
            const otherLanguage = this.language === 'en' ? 'ru' : 'en';
            const otherLanguageMuscleWiki = this.muscle[otherLanguage].wiki;
            if(otherLanguageMuscleWiki) {
                this.wikipediaFrameEl.src = 'https://' + otherLanguage + '.m.wikipedia.org/wiki/' + otherLanguageMuscleWiki;
                this.wikipediaBtnEl.classList.remove('hidden');
            }
            else {
                this.wikipediaBtnEl.classList.add('hidden');
                this.setPanel('google');
            }
        }
    }

    // Initialize the application
    init() {
        // Set initial wiki URL
        this.wikipediaFrameEl.src = 'https://' + this.language + '.m.wikipedia.org/wiki/' + this.initWikiUrls[this.language];

        // Set initial panel
        this.setPanel('google');

        // Set button texts
        this.setButtonsTexts();

        // Set language
        this.setLanguage(this.language);

        // Initialize human model
        this.initHuman('male');

        this.setGoogleSuggestion('strengthening');
    }
}

// Create and initialize the application
const atlas = new Atlas();
atlas.init();
