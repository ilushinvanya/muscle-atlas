const maleId = '5Ac8';
const femaleId = '5Ac9'

const maleBtn = document.getElementById('male-btn');
const femaleBtn = document.getElementById('female-btn');

const wikipediaDomain = 'https://ru.m.wikipedia.org/w/index.php?search=';
let wikipediaSearchQuery = '%D0%9C%D1%8B%D1%88%D1%86%D1%8B_%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D1%8B_%D1%87%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA%D0%B0';

const wikipediaFrameEl = document.querySelector('#wikipedia iframe');

function setWikipediaSrc() {
	wikipediaFrameEl.src = wikipediaDomain + wikipediaSearchQuery;
}


function onClickMuscle(muscleId) {

	console.log('scene.objectsSelected event: ', muscleId);
	let eventName;
	let eventStatus;
	Object.entries(muscleId).forEach(([key, value]) => {
		eventName = key;
		eventStatus = value;
	})
	const reg = new RegExp(/-(\w*)_ID/);
	const regMatch = eventName.match(reg);
	const muscle = regMatch[1];

	// console.log(muscle, eventStatus);

	const googleSearchInput = google.search.cse.element.getElement('storesearch');
	if(eventStatus) {
		const clearMuscle = muscle.replaceAll('_', ' ');
		googleSearchInput.execute(clearMuscle + ' ' + currentGoogleSuggestion);
		wikipediaSearchQuery = clearMuscle;
		setWikipediaSrc();
	} else {
		googleSearchInput.clearAllResults();
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
// initHuman(femaleId);




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
}
