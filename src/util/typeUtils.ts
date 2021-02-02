/**
 * Unwrap type from Promise
 */
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T

export const copyProperities = function (target: any, source: any) {
    for (let key in source) {
        target[key] = source[key]
    }
}
