#!/usr/bin/env node

import 'node-env-dev'
import * as execa from 'execa'
import * as fs from 'fs-extra'
import * as loudness from 'loudness'
import * as notifier from 'node-notifier'
import * as os from 'os'
import * as path from 'path'
import * as pify from 'pify'
import * as R from 'rambda'
import * as S from 'string-fn'
import * as schedule from 'node-schedule'
import * as which from 'which'
import storage from './storage'
import { getSounds, getAssetsPath } from './assets'
import { player } from './player'
import { prompt, Select } from 'enquirer'

const answers = {
	// title: 'this is my super long title for a notification',
	title: storage.get('prompt.initial.title') as string,
	subtitle: '',
	interval: storage.get('prompt.initial.interval') as string,
	sound: storage.get('prompt.initial.sound') as string,
	volume: storage.get('prompt.initial.volume') as string,
	icon: path.join(getAssetsPath('images'), 'logo.png'),
}
interface Answers extends Partial<typeof answers> {}

process.nextTick(async () => {
	let { title = '' } = await prompt({
		initial: answers.title,
		message: 'Task description',
		name: 'title',
		required: true,
		result: (value) => S.trim(value),
		type: 'input',
		validate: (value) => !!S.trim(value),
	})
	storage.set('prompt.initial.title', title)
	answers.title = title

	let intervals = [
		{ message: '5 Minutes', name: '5' },
		{ message: '10 Minutes', name: '10' },
		{ message: '15 Minutes', name: '15' },
		{ message: '30 Minutes', name: '30' },
		{ message: '60 Minutes', name: '60' },
	]
	let { interval = '' } = await prompt({
		choices: intervals,
		initial: answers.interval ? intervals.findIndex((v) => v.name == answers.interval) : 0,
		message: 'Reminder interval',
		name: 'interval',
		required: true,
		type: 'select',
	})
	storage.set('prompt.initial.interval', interval)
	answers.interval = interval

	let sounds = (await getSounds()).map((v) => ({ message: v.name, name: v.path }))
	let soundprompt = new Select({
		choices: sounds,
		initial: answers.sound ? sounds.findIndex((v) => v.name == answers.sound) : 0,
		message: 'Notification sound',
		required: true,
		type: 'select',
	} as ConstructorParameters<typeof Select>[0])
	soundprompt.on('choice', (choice, index, prompt) => {
		if (index != prompt.index) return
		player.play(choice.value)
	})
	answers.sound = await soundprompt.run()
	storage.set('prompt.initial.sound', answers.sound)

	let volumes = [
		{ message: 'Inherit system', name: '0' },
		{ message: '10  █_______', name: '10' },
		{ message: '25  ██______', name: '25' },
		{ message: '50  ████____', name: '50' },
		{ message: '75  ██████__', name: '75' },
		{ message: '100 ████████', name: '100' },
	]
	let { volume = '' } = await prompt({
		choices: volumes,
		initial: answers.volume ? volumes.findIndex((v) => v.name == answers.volume) : 0,
		message: 'Notification volume',
		name: 'volume',
		required: true,
		type: 'select',
	})
	storage.set('prompt.initial.volume', volume)
	answers.volume = volume

	let words = answers.title.split(' ')
	answers.title = words.shift()
	while (`${answers.title} ${words[0]}`.length <= 30) {
		answers.title += ` ${words.shift()}`
	}
	answers.subtitle = words.join(' ')

	if (process.env.NODE_ENV == 'development') {
		console.log(`answers ->`, answers)
	}

	alert(answers)
	notify(answers)
	schedule.scheduleJob(`*/${answers.interval} * * * *`, () => {
		notify(answers)
		alert(answers)
	})
})

async function notify(answers: Answers) {
	return new Promise<string>((resolve, reject) => {
		notifier.notify(
			{
				contentImage: answers.icon,
				message: answers.subtitle,
				sound: false,
				title: answers.title,
				wait: false,
			},
			(error, response) => (error ? reject(error) : resolve(response)),
		)
	})
}

async function alert(answers: Answers) {
	let muted = await loudness.getMuted()
	if (muted || !answers.sound) return
	let volume = await loudness.getVolume()
	await loudness.setVolume(Number.parseInt(answers.volume))
	await new Promise((r) => setTimeout(r, 300))
	await player.play(answers.sound)
	await loudness.setVolume(volume)
}

// function exit(code = 0) {
// 	process.nextTick(() => process.exit(code))
// }
// if (!process.DEVELOPMENT) {
// 	process.once('uncaughtException', () => exit(1))
// 	process.once('unhandledRejection', () => exit(1))
// }
