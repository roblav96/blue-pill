import * as execa from 'execa'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as os from 'os'
import * as which from 'which'
import PQueue from 'p-queue'

export async function getSounds() {
	let assets = getAssetsPath()
	let sounds = (await fs.readdir(assets)).map(filename => ({
		path: path.join(assets, filename)
	}))

	let queue = new PQueue({ concurrency: os.cpus().length })
	console.log('sounds ->', sounds)
}

function getAssetsPath() {
	for (let folder = __dirname; ; ) {
		let assets = path.join(folder, 'assets')
		if (fs.pathExistsSync(assets)) {
			return assets
		}
		if (folder == path.parse(folder).root) {
			throw new Error(`Could not find 'assets' folder`)
		}
		folder = path.dirname(folder)
		// await new Promise((r) => setTimeout(r, 1000))
	}
}
