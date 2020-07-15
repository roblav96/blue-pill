#!/usr/bin/env node

import 'node-env-dev'
import * as Configstore from 'configstore'
import * as execa from 'execa'
import * as fs from 'fs-extra'
import * as loudness from 'loudness'
import * as notifier from 'node-notifier'
import * as os from 'os'
import * as path from 'path'
import * as pify from 'pify'
import * as schedule from 'node-schedule'
import * as shell from 'shelljs'
import * as which from 'which'
import { Player } from './player'
import { prompt } from 'enquirer'

const storage = new Configstore(path.parse(__filename).name)

const players = {
	play: '--no-show-progress',
	mpv: '--no-terminal',
	mplayer: '',
	afplay: '',
	aplay: '',
	omxplayer: '',
	mpg123: '',
	mpg321: '',
	cmdmp3: '',
}
let player = Object.keys(players).find((v) => !!which.sync(v, { all: false, nothrow: true }))
console.log('player ->', player)

// const player = require('play-sound')() as {
// 	player: string
// 	players: string[]
// 	play(sound: string, next?: (error?: Error) => void): void
// 	// pplay(sound: string): Promise<void>
// }
// if (os.platform() == 'darwin') {
// 	player.player = 'play'
// }
// // const pplayer = pify(player)
// // Object.assign(player, { pplay: util.promisify(player.play) })
// // console.log('player ->', player)

process.nextTick(async () => {
	console.time(`which`)
	for (let i = 0; i < 100; i++) {
		let player = which.sync('afplay', { nothrow: true })
		// let player = shell.which('afplay').toString()
		console.log('player ->', player)
	}
	console.timeEnd(`which`)

	return

	let sound = path.join(__dirname, 'assets/Ping.ogg')
	console.log('sound ->', sound)
	let played = await execa.node

	// console.log('player ->', player)
	// let played = player.play(sound, function (error) {
	// 	if (error) console.error(`player.play -> %O`, error)
	// })
	// console.log('played ->', played)

	let answer = await prompt({
		message: 'Task description',
		name: 'description',
		type: 'input',
	})
	console.log('answer ->', answer)
})

// import ora from 'ora'
// import * as fs from 'fs-extra'
// import * as path from 'path'
// import * as schedule from 'node-schedule'
// import * as notifier from 'node-notifier'
// import * as configstore from 'configstore'
// import * as prompts from 'prompts'
// import * as loudness from 'loudness'

// const player = require('play-sound')() as { play(sound: string, cb?: any): void }
// const pkg = fs.readJsonSync(path.join(__dirname, '../package.json'))
// const storage = new configstore(pkg.name)

// const answers = {
// 	title: '',
// 	subtitle: ' ',
// 	interval: 0,
// 	sound: '',
// 	volume: 0,
// }
// interface Answers extends Partial<typeof answers> {}

// async function start() {
// 	answers.title = (await prompts.prompts.text({
// 		message: `Task description`,
// 		initial: storage.get('title.initial'),
// 	} as prompts.PromptObject)) as any
// 	if (answers.title) storage.set('title.initial', answers.title)
// 	answers.title = answers.title || `Task was not described...`

// 	answers.interval = Number.parseInt((await prompts.prompts.select({
// 		message: `Reminder interval`,
// 		initial: 1,
// 		choices: [
// 			{ title: '5 Minutes', value: '5' },
// 			{ title: '10 Minutes', value: '10' },
// 			{ title: '15 Minutes', value: '15' },
// 			{ title: '30 Minutes', value: '30' },
// 			{ title: '60 Minutes', value: '60' },
// 		],
// 	} as prompts.PromptObject)) as any)

// 	let soundsdir = path.join(__dirname, '../sounds')
// 	let sounds = fs.readdirSync(soundsdir).reverse()
// 	answers.sound = (await prompts.prompts.select({
// 		message: `Alert sound`,
// 		initial: 1,
// 		choices: [{ title: `🔕  Silent`, value: '' }].concat(
// 			sounds
// 				.filter(v => v.endsWith('.wav'))
// 				.map(sound => ({
// 					title: sound.slice(0, -4),
// 					value: path.join(soundsdir, sound),
// 				}))
// 		),
// 		onState: function({ value }) {
// 			value && player.play(value)
// 		} as any,
// 		// onRender: async function(this: prompts.PromptObject) {
// 		// 	let muted = await loudness.getMuted()
// 		// 	if (muted) this.hint = 'Your system volume is muted'
// 		// },
// 	} as prompts.PromptObject)) as any

// 	if (answers.sound) {
// 		answers.volume = Number.parseInt((await prompts.prompts.select({
// 			message: 'Alert volume',
// 			initial: 0,
// 			choices: [
// 				{ title: 'Inherit system', value: '0' },
// 				{ title: '█_______', value: '10' },
// 				{ title: '██______', value: '25' },
// 				{ title: '████____', value: '50' },
// 				{ title: '████████', value: '100' },
// 			],
// 		} as prompts.PromptObject)) as any)
// 	}

// 	let words = answers.title.split(' ')
// 	let title = []
// 	let max = 32
// 	while (max > 0 && words.length > 0) {
// 		let word = words.shift()
// 		max -= word.length
// 		title.push(word)
// 	}
// 	answers.title = title.join(' ')
// 	if (words.length > 0) answers.subtitle = words.join(' ')

// 	ora({ color: 'cyan', spinner: 'bouncingBall', interval: 100 }).start()

// 	notify(answers)
// 	alert(answers)
// 	schedule.scheduleJob(`*/${answers.interval} * * * *`, function() {
// 		notify(answers)
// 		alert(answers)
// 	})
// }
// start().catch(error => console.error(`catch Error ->`, error))

// function notify(answers: Answers) {
// 	notifier.notify({
// 		title: answers.title,
// 		message: answers.subtitle,
// 		icon: path.join(__dirname, '../logo/logo.png'),
// 		wait: true,
// 	})
// }

// async function alert(answers: Answers) {
// 	let muted = await loudness.getMuted()
// 	if (muted || !answers.sound) return
// 	let volume = await loudness.getVolume()
// 	await loudness.setVolume(answers.volume)
// 	await new Promise(r => setTimeout(r, 500))
// 	await new Promise(resolve => {
// 		player.play(answers.sound, error => {
// 			if (error) console.error(`player.play Error ->`, error)
// 			resolve()
// 		})
// 	})
// 	await loudness.setVolume(volume)
// }

// declare module 'prompts' {
// 	interface PromptObject {
// 		onRender(): any
// 	}
// }
