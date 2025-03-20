const maleId = '5Ac8';
const femaleId = '5Ac9'

const maleBtn = document.getElementById('male-btn');
const femaleBtn = document.getElementById('female-btn');

let muscle = {
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
}

async function onClickMuscle(muscleId) {
	console.log('scene.objectsSelected event: ', muscleId);
	let eventName;
	let eventStatus;
	Object.entries(muscleId).forEach(([key, value]) => {
		eventName = key;
		eventStatus = value;
	})

	if(eventStatus) {
		const muscleName = eventName.replaceAll(/(human_17|_male_|_female_|muscular_system-|left_|right_|_ID)/g, '')

		const res = await fetch('./data/muscles/' + muscleName + '.json')
		muscle = await res.json();

		setGoogleQuery();
		setWikipediaSrc();
		setHeaderLabel();
		setPhysiotherapist();
	} else {
		clearGoogleResults();
	}
}

let human = new HumanAPI('human');

const initHuman = (modelId) => {
	const bioDigitalPath = 'https://human.biodigital.com/widget/?be=' + modelId + '&ui-tour=false&ui-info=false&ui-fullscreen=false&ui-share=false&uaid=' + modelId;
	document.getElementById('human').src = bioDigitalPath;
	human = new HumanAPI('human');

	maleBtn.classList.remove('active');
	femaleBtn.classList.remove('active');
	if(modelId === maleId) {
		maleBtn.classList.add('active');
	}
	if(modelId === femaleId) {
		femaleBtn.classList.add('active');
	}

	const objectID = [];
	const objectName= [];
	human.send('scene.info', (data) => {
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
		console.log('available', available)
		console.log('noAvailable', noAvailable)
		// create display list of object names
		// var table = document.getElementById('list');
		// for(var i = 0; i < objectName.length; i++){
		//     var row = table.insertRow(i);
		//     var cell = row.insertCell(0);
		//     cell.innerHTML = objectName[i];
		// }
	});
	human.on('scene.objectsSelected', onClickMuscle)
}
initHuman(maleId);








// Panels
const googleBtnEl = document.getElementById('google-btn');
const wikipediaBtnEl = document.getElementById('wikipedia-btn');
const physiotherapistBtnEl = document.getElementById('physiotherapist-btn');

const panelGoogleEl = document.getElementById('google');
const panelWikipediaEl = document.getElementById('wikipedia');
const panelPhysiotherapistEl = document.getElementById('physiotherapist');

const elements = {
	google: {
		button: googleBtnEl,
		panel: panelGoogleEl
	},
	wikipedia: {
		button: wikipediaBtnEl,
		panel: panelWikipediaEl
	},
	physiotherapist: {
		button: physiotherapistBtnEl,
		panel: panelPhysiotherapistEl
	}
}

function setPanel(name) {
	allHide();
	toggleElement(name, true);
}
function allHide() {
	toggleElement('google', false);
	toggleElement('wikipedia', false);
	toggleElement('physiotherapist', false);
}
function toggleElement(name, visible) {
	if(visible) {
		elements[name].button.classList.add('active');
		elements[name].panel.classList.remove('hidden');
	}
	else {
		elements[name].button.classList.remove('active');
		elements[name].panel.classList.add('hidden');
	}
}
setPanel('google')
// END Panels



// Google
let currentGoogleSuggestion = ''
const stretchBtnEl = document.getElementById('stretch-btn');
const strengtheningBtnEl = document.getElementById('strengthening-btn');
function setGoogleSuggestion(name) {
	currentGoogleSuggestion = name;
	if (name === 'stretch') {
		stretchBtnEl.classList.add('active')
		strengtheningBtnEl.classList.remove('active')
	}
	if (name === 'strengthening') {
		strengtheningBtnEl.classList.add('active')
		stretchBtnEl.classList.remove('active')
	}
	setGoogleQuery()
}

function setGoogleQuery() {
	const googleSearchInput = google.search.cse.element.getElement('storesearch');
	const suggestionText = buttonsText[currentGoogleSuggestion] ? buttonsText[currentGoogleSuggestion][language].replace(/[^a-zA-Zа-яА-Я]*/, '') : '';
	googleSearchInput.execute(suggestionText + ' ' + muscle[language].label);
}
function clearGoogleResults() {
	const googleSearchInput = google.search.cse.element.getElement('storesearch');
	googleSearchInput.clearAllResults();
}
// End Google



// Language
let language = 'en';
const enBtnEl = document.getElementById('en-btn');
const ruBtnEl = document.getElementById('ru-btn');
function setLanguage(lang) {
	language = lang;
	setButtonsTexts()
	if(muscle[language].wiki) {
		setWikipediaSrc()
	}
	if(muscle[language].label) {
		setGoogleQuery()
		setHeaderLabel()
	}
	if(language === 'ru') {
		ruBtnEl.classList.add('active')
		enBtnEl.classList.remove('active')
	}
	if(language === 'en') {
		enBtnEl.classList.add('active')
		ruBtnEl.classList.remove('active')
	}
}
// End Language







// Title and Buttons
const headerLabelEl = document.querySelector('#muscle-name');
function setHeaderLabel() {
	headerLabelEl.innerHTML = muscle[language].label;
}

const buttonsText = {
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
}
function setButtonsTexts() {
	stretchBtnEl.innerHTML = buttonsText.stretch[language];
	strengtheningBtnEl.innerHTML = buttonsText.strengthening[language]
	maleBtn.innerHTML = buttonsText.male[language]
	femaleBtn.innerHTML = buttonsText.female[language]
}
setButtonsTexts()
setLanguage(language)
// End Title and Buttons











// Physiotherapist
const physiotherapistFrameEl = document.querySelector('#physiotherapist iframe');
function setPhysiotherapist() {
	const musclePhysiotherapist = muscle.physiotherapist;
	if(musclePhysiotherapist) {
		physiotherapistFrameEl.src = 'https://physiotherapist.ru/muscles/' + musclePhysiotherapist;
		physiotherapistBtnEl.classList.remove('hidden')
	}
	else {
		physiotherapistBtnEl.classList.add('hidden')
		setPanel('google')
	}
}
// End Physiotherapist






// Wiki
const wikipediaFrameEl = document.querySelector('#wikipedia iframe');
function setWikipediaSrc() {
	const muscleWiki = muscle[language].wiki;
	if(muscleWiki) {
		wikipediaFrameEl.src = 'https://' + language + '.m.wikipedia.org/wiki/' + muscleWiki;
		wikipediaBtnEl.classList.remove('hidden')
	}
	else {
		wikipediaBtnEl.classList.add('hidden')
		setPanel('google')
	}
}

const initWikiUrls = {
	ru: 'Мышечная_система',
	en: 'Muscular_system'
}

wikipediaFrameEl.src = 'https://' + language + '.m.wikipedia.org/wiki/' + initWikiUrls[language];
// End Wiki
