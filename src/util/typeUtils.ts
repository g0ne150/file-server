/**
 * Unwrap type from Promise
 */
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T
