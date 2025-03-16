const fs = require('fs')

const jsonFile = fs.readFileSync('./uniq_union.json', 'utf8')

const rus = JSON.parse(jsonFile)

const list = Object.keys(rus);

const result = {}
for(let i = 0; i < list.length; i++) {
	result[list[i]] = {
		ruLabel: '',
		enLabel: '',
		ruWiki: '',
		enWiki: '',
		kenhub: '',
		physiotherapist: ''
	};
}

console.log(result)
fs.writeFileSync('./uniq_objects_union.json', JSON.stringify(result, null, '\t'))

