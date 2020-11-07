export * from '../types'

export { default as Id } from './Id'
export { default as Theorem } from './Theorem'
export { default as Theorems } from './Theorems'
export { default as Traits } from './Traits'

export type Collection<V, K = number> = {
  all: V[]
  find(id: K): V | null
}
