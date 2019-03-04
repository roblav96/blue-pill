#! /usr/bin/env node

const util = require('util'); Object.assign(util.inspect.defaultOptions, { breakLength: Infinity, colors: true, compact: false, depth: 2, maxArrayLength: Infinity, showHidden: false, showProxy: false, sorted: true }); Object.assign(util.inspect.styles, { boolean: 'blue', date: 'green', null: 'red', number: 'magenta', regexp: 'green', special: 'cyan', string: 'green', symbol: 'grey', undefined: 'red' });
import ora from 'ora'
import * as fs from 'fs'
import * as path from 'path'
import * as schedule from 'node-schedule'
import * as notifier from 'node-notifier'
import * as prompts from 'prompts'
const player = require('play-sound')() as { play(sound: string): void }



let sounds = path.join(__dirname, '../sounds')
prompts([
	{
		type: 'text',
		name: 'title',
		message: 'Task description',
	},
	{
		type: 'select',
		name: 'duration',
		message: 'Reminder interval',
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
		message: 'Alert sound',
		initial: 5,
		choices: [{ title: 'None', value: '' }].concat(fs.readdirSync(sounds).filter(v => v.endsWith('.wav')).map(sound => ({
			title: sound.slice(0, -4),
			value: path.join(sounds, sound),
		}))),
		onState({ value }) {
			value && player.play(value)
		},
	},
],
	{
		onCancel(prompt, answers) {
			throw new Error('onCancel')
		},
	},
).then(answers => {
	answers.title = answers.title || 'Digesting the blue pill...'
	ora({ color: 'blue', spinner: 'bouncingBall', interval: 100 }).start()
	notify(answers.title)
	schedule.scheduleJob(`*/${answers.duration} * * * *`, date => {
		notify(answers.title, answers.sound)
	})
}).catch(function(error) {
	console.error(`answers Error ->`, error)
	process.exit(0)
})

function notify(title: string, sound = '') {
	notifier.notify({
		title, message: ' ',
		icon: path.join(__dirname, '../logo/logo.png'),
	})
	sound && setTimeout(() => player.play(sound), 500)
}


