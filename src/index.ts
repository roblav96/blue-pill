
const util = require('util'); Object.assign(util.inspect.defaultOptions, { breakLength: Infinity, colors: true, compact: false, depth: 2, maxArrayLength: Infinity, showHidden: false, showProxy: false, sorted: true }); Object.assign(util.inspect.styles, { boolean: 'blue', date: 'green', null: 'red', number: 'magenta', regexp: 'green', special: 'cyan', string: 'green', symbol: 'grey', undefined: 'red' });
import * as notifier from 'node-notifier'
import * as prompts from 'prompts'



(async function() {
	let input = await prompts([
		{
			type: 'text',
			name: 'text',
			message: 'I need to focus on:',
		},
		{
			type: 'select',
			name: 'duration',
			message: 'Reminded me every:',
			// initial: 1,
			choices: [
				{ title: '5 Minutes', value: '5' },
				{ title: '10 Minutes', value: '10' },
				{ title: '15 Minutes', value: '15' },
				{ title: '30 Minutes', value: '30' },
				{ title: '60 Minutes', value: '60' },
			],
		},
	])
	console.log(`input ->`, input)
})()


