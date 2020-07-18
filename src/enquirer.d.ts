import * as enquirer from 'enquirer'

declare module 'enquirer' {
	class Select extends Prompt {}
}
