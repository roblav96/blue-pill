import * as execa from 'execa'
import * as fs from 'fs-extra'
import * as loudness from 'loudness'
import * as path from 'path'
import * as which from 'which'

type Options = ConstructorParameters<typeof Player>[0]
export interface Player extends Options {}
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
	constructor(options = {} as Partial<{ args: string; player: string }>) {
		Object.assign(this, options)
		if (!this.player) {
			this.player = Object.keys(Player.players).find(
				(player) => !!which.sync(player, { all: false, nothrow: true }),
			)
			if (!this.player) {
				throw new Error(`Could not find a player executable binary`)
			}
		}
		if (!this.args) {
			this.args = Player.players[this.player] || ''
		}
	}
	async play(sound: string) {
		let args = this.args.split(' ').filter(Boolean)
		await execa(this.player, args.concat(sound))
	}
}

export const player = new Player()
