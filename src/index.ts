
const util = require('util'); Object.assign(util.inspect.defaultOptions, { breakLength: Infinity, colors: true, compact: false, depth: 2, maxArrayLength: Infinity, showHidden: false, showProxy: false, sorted: true }); Object.assign(util.inspect.styles, { boolean: 'blue', date: 'green', null: 'red', number: 'magenta', regexp: 'green', special: 'cyan', string: 'green', symbol: 'grey', undefined: 'red' });
import * as _ from 'lodash'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as dayjs from 'dayjs'
import * as schedule from 'node-schedule'
import * as notifier from 'node-notifier'
import * as enquirer from 'enquirer'
import * as prompts from 'prompts'



// (async function() {
let soundsdir = path.resolve(__dirname, '../sounds')
	/*let stdin = await*/ prompts([
	{
		type: 'text',
		name: 'text',
		message: 'Remind me to stay focused on:',
	},
	{
		type: 'select',
		name: 'duration',
		message: 'Reminder notification interval',
		initial: 1,
		choices: [
			{ title: '5 Minutes', value: '5' },
			{ title: '10 Minutes', value: '10' },
			{ title: '15 Minutes', value: '15' },
			{ title: '30 Minutes', value: '30' },
			{ title: '60 Minutes', value: '60' },
		],
	},
	{
		type: 'select',
		name: 'sound',
		message: 'With this notification sound',
		initial: 0,
		choices: fs.readdirSync(soundsdir).map(sound => ({
			title: path.basename(sound),
			value: sound,
		})),
	},
],
	{
		onCancel(prompt, answers) {
			throw new Error('onCancel')
		},
	},
).then(stdin => {
	let input = {
		text: stdin.text || 'Stay focused on something...',
		duration: Number.parseInt(stdin.duration),
		sound: stdin.sound as string,
		path: path.resolve(soundsdir, stdin.sound),
	}
	console.log(`input ->`, input)
}).catch(function(error) {
	console.error(`stdin Error ->`, error)
	// process.exit(0)
})
// })()


