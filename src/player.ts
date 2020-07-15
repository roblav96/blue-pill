import * as execa from 'execa'
import * as fs from 'fs-extra'
import * as loudness from 'loudness'
import * as path from 'path'
import * as which from 'which'

export class Player {
	static players = {
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
	constructor(public options = {} as Partial<{ args: string; player: string }>) {
		if (!options.player) {
			options.player = Object.keys(Player.players).find(
				(player) => !!which.sync(player, { all: false, nothrow: true }),
			)
			if (!options.player) {
				throw new Error(`Could not find a player executable binary`)
			}
		}
		if (!options.args) {
			options.args = Player.players[options.player] || ''
		}
	}
	async play(sound: string) {
		let args = this.options.args.split(' ').filter(Boolean)
		let played = await execa(this.options.player, args.concat(sound))
		console.log('played ->', played)
	}
}
