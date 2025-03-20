const fs = require('fs')

const jsonFile = fs.readFileSync('./master-muscles.json', 'utf8')

const rus = JSON.parse(jsonFile)

const entries = Object.entries(rus);
entries.forEach(([key, value]) => {
	console.log(key)
	console.log(value)
	fs.writeFileSync('./muscles/' + key + '.json', JSON.stringify(value, null, '\t'))
})
