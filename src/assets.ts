import * as execa from 'execa'
import * as fs from 'fs-extra'
import * as os from 'os'
import * as path from 'path'
import * as R from 'rambda'
import * as S from 'string-fn'
import * as which from 'which'
import * as junk from 'junk'
import PQueue from 'p-queue'
import storage from './storage'

export async function getSounds() {
	let assets = getAssetsPath('sounds')
	let files = (await fs.readdir(assets)).filter(junk.not)
	let sounds = files.map((file) => ({
		name: S.titleCase(path.parse(file).name),
		path: path.join(assets, file),
		// duration: Number.parseFloat(storage.get(`${filename}.duration`)),
	}))
	return R.sortBy(R.compose(R.toLower, R.prop('name')), sounds)
	// let ffprobe = which.sync('ffprobe', { all: false, nothrow: true })
	// if (ffprobe) {
	// 	let queue = new PQueue({ concurrency: os.cpus().length })
	// 	for (let sound of sounds) {
	// 		if (Number.isFinite(sound.duration)) continue
	// 		queue.add(async () => {
	// 			let options = `-loglevel error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1`
	// 			let duration = (await execa(ffprobe, [...options.split(' '), sound.path])).stdout
	// 			storage.set(`${sound.filename}.duration`, duration)
	// 			sound.duration = Number.parseFloat(duration)
	// 		})
	// 	}
	// 	await queue.onIdle()
	// }
	// sounds.sort((a, b) => a.duration - b.duration)
	// return sounds
}

export function getAssetsPath(media = '' as 'images' | 'sounds') {
	for (let folder = __dirname; ; ) {
		let assets = path.join(folder, 'assets')
		if (fs.pathExistsSync(assets)) {
			return path.join(assets, media)
		}
		if (folder == path.parse(folder).root) {
			throw new Error(`Could not find 'assets' folder`)
		}
		folder = path.dirname(folder)
		// await new Promise((r) => setTimeout(r, 1000))
	}
}
