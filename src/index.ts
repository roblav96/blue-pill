#! /usr/bin/env node

const util = require('util'); Object.assign(util.inspect.defaultOptions, { breakLength: Infinity, colors: true, compact: false, depth: 2, maxArrayLength: Infinity, showHidden: false, showProxy: false, sorted: true }); Object.assign(util.inspect.styles, { boolean: 'blue', date: 'green', null: 'red', number: 'magenta', regexp: 'green', special: 'cyan', string: 'green', symbol: 'grey', undefined: 'red' });
import ora from 'ora'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as schedule from 'node-schedule'
import * as notifier from 'node-notifier'
import * as configstore from 'configstore'
import * as prompts from 'prompts'
import * as loudness from 'loudness'
const player = require('play-sound')() as { play(sound: string): void }
const pkg = fs.readJsonSync(path.join(__dirname, '../package.json'))
const storage = new configstore(pkg.name)



interface Answers extends Partial<typeof answers> { }
const answers = {
	title: '', subtitle: ' ',
	interval: 0, sound: '', volume: 0,
}

async function start() {

	answers.title = await prompts.prompts.text({
		message: `Task description`,
		initial: storage.get('title.initial'),
	} as prompts.PromptObject) as any
	if (answers.title) storage.set('title.initial', answers.title);
	answers.title = answers.title || `Task was not described...`

	answers.interval = Number.parseInt(await prompts.prompts.select({
		message: `Reminder interval`,
		initial: 1,
		choices: [
			{ title: '5 Minutes', value: '5' },
			{ title: '10 Minutes', value: '10' },
			{ title: '15 Minutes', value: '15' },
			{ title: '30 Minutes', value: '30' },
			{ title: '60 Minutes', value: '60' },
		],
	} as prompts.PromptObject) as any)

	let soundsdir = path.join(__dirname, '../sounds')
	let sounds = fs.readdirSync(soundsdir).reverse()
	answers.sound = await prompts.prompts.select({
		message: `Alert sound`,
		initial: 1,
		choices: [{ title: `🔕  Silent`, value: '' }].concat(
			sounds.filter(v => v.endsWith('.wav')).map(sound => ({
				title: sound.slice(0, -4),
				value: path.join(soundsdir, sound),
			}))
		),
		onState: function({ value }) { value && player.play(value) } as any,
		// onRender: async function(this: prompts.PromptObject) {
		// 	let muted = await loudness.getMuted()
		// 	if (muted) this.hint = 'Your system volume is muted'
		// },
	} as prompts.PromptObject) as any

	if (answers.sound) {
		answers.volume = Number.parseInt(await prompts.prompts.select({
			message: 'Alert volume',
			initial: 0,
			choices: [
				{ title: 'Inherit system', value: '0' },
				{ title: '█_______', value: '10' },
				{ title: '██______', value: '25' },
				{ title: '████____', value: '50' },
				{ title: '████████', value: '100' },
			],
		} as prompts.PromptObject) as any)
	}

	let words = answers.title.split(' ')
	let title = []
	let max = 32
	while (max > 0 && words.length > 0) {
		let word = words.shift()
		max -= word.length
		title.push(word)
	}
	answers.title = title.join(' ')
	if (words.length > 0) answers.subtitle = words.join(' ');

	ora({ color: 'cyan', spinner: 'bouncingBall', interval: 100 }).start()

	notify(answers)
	schedule.scheduleJob(`*/${answers.interval} * * * *`, function() {
		notify(answers); alert(answers)
	})

} start().catch(function(error) {
	console.error(`start Error ->`, error)
	process.exit(0)
})

function notify(answers: Answers) {
	notifier.notify({
		title: answers.title, message: answers.subtitle,
		icon: path.join(__dirname, '../logo/logo.png'),
	})
}

async function alert(answers: Answers) {
	let muted = await loudness.getMuted()
	if (muted || !answers.sound) return;
	let volume = await loudness.getVolume()
	await loudness.setVolume(answers.volume)
	await new Promise(r => setTimeout(r, 500))
	await util.promisify(player.play)(answers.sound)
	await loudness.setVolume(volume)
}



declare module 'prompts' { interface PromptObject { onRender(): any } }


