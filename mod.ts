#!/usr/bin/env -S deno run

import * as cliffy from 'https://deno.land/x/cliffy/mod.ts'
import * as Fae from 'https://deno.land/x/fae/mod.ts'
import * as fs from 'https://deno.land/std/fs/mod.ts'
import * as module from 'https://deno.land/std/node/module.ts'

const require = module.createRequire(import.meta.url)

// /** @type _ { typeof import("lodash") } */
// const _ = require('lodash') as typeof import('./node_modules/@types/lodash/index.d.ts')
// console.log(`_ ->`, _)

// /** @deno-types='./node_modules/rambda/index.d.ts' */
const R = require('rambda') as typeof import('./node_modules/rambda/index.d.ts')
console.log(`R ->`, R)

// console.log(`module ->`, module.createRequire)
// console.log(`import.meta ->`, import.meta)
// console.log(`require ->`, require)

// console.log(`lodash ->`, lodash)

// console.log('getSoundFiles() ->', await getSoundFiles())
// async function getSoundFiles() {
// 	let entries = [] as fs.WalkEntry[]
// 	fs.walkSync
// 	for await (let entry of fs.walk('sounds')) {
// 		if (!entry.isFile) continue
// 		entries.push(entry)
// 	}
// 	return entries
// }

// let checkbox = await new Checkbox()
// // comma separated list
// console.log('checkbox ->', checkbox)
// console.log(`checkbox ->`, checkbox)

// let command = await new Command()
// 	// space separated list
// 	.option('-o, --list --separated-list <string>', 'space separated list of strings.', {
// 		separator: ' ',
// 	})
// 	.parse(Deno.args)
// console.log(command.options)
// console.log(`command.options ->`, command.options)
