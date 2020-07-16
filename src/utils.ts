import * as R from 'rambda'
import * as S from 'string-fn'

export function pDelay(ms: number) {
	return new Promise<void>((r) => setTimeout(r, ms))
}
