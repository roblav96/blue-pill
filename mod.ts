#!/usr/bin/env -S deno run

// import lodash from 'https://cdn.pika.dev/lodash'
import * as Fae from 'https://deno.land/x/fae/mod.ts'
import * as fs from 'https://deno.land/std/fs/mod.ts'
import { Checkbox } from 'https://deno.land/x/cliffy/prompt.ts'
import { Command, ActionListType } from 'https://deno.land/x/cliffy/command.ts'

import * as module from 'https://deno.land/std/node/module.ts'
console.log(`module ->`, module.createRequire)
console.log(`import.meta ->`, import.meta)
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
