import * as F from '@pi-base/core/lib/Formula'

import { Data, Formula, Id, Property, Space, Trait } from '../models'

export default class Traits {
  private traits: Map<string, Trait>
  private spaces: Map<number, Space>
  private properties: Map<number, Property>

  static fromData(
    data: Pick<Data, 'properties' | 'spaces' | 'traits'> | undefined,
  ): Traits {
    if (data) {
      return new Traits(data.traits, data.spaces, data.properties)
    } else {
      return new Traits()
    }
  }

  constructor(
    traits: Trait[] = [],
    spaces: Space[] = [],
    properties: Property[] = [],
  ) {
    this.traits = new Map(
      traits.map((t) => [this.traitId(t.space, t.property), t]),
    )
    this.spaces = new Map(spaces.map((s) => [Id.toInt(s.uid), s]))
    this.properties = new Map(properties.map((p) => [Id.toInt(p.uid), p]))
  }

  add(traits: Trait[]): Traits {
    return new Traits(
      [...this.traits.values(), ...traits],
      [...this.spaces.values()],
      [...this.properties.values()],
    )
  }

  find(space: Space, property: Property) {
    return this.traits.get(this.traitId(space.uid, property.uid))
  }

  forProperty(property: Property): [Space, Trait][] {
    return this.collect(this.spaces, (space) => this.find(space, property))
  }

  forSpace(space: Space): [Property, Trait][] {
    return this.collect(this.properties, (property) =>
      this.find(space, property),
    )
  }

  get size() {
    return this.traits.size
  }

  evaluate({ formula, space }: { formula: Formula<Property>; space: Space }) {
    const traits = new Map(
      this.forSpace(space).map(([property, trait]) => [
        property.uid,
        trait.value,
      ]),
    )
    const mapped = F.mapProperty((p) => p.uid, formula)
    return F.evaluate(mapped, traits)
  }

  isCounterexample(
    { when, then }: { when: Formula<Property>; then: Formula<Property> },
    space: Space,
  ): boolean {
    return (
      this.evaluate({
        formula: F.and(when, F.negate(then)),
        space,
      }) === true
    )
  }

  private traitId(space: string, property: string) {
    return `${Id.toInt(space)}.${Id.toInt(property)}`
  }

  private collect<T>(
    collection: Map<unknown, T>,
    lookup: (item: T) => Trait | undefined,
  ): [T, Trait][] {
    const result: [T, Trait][] = []
    collection.forEach((item) => {
      const trait = lookup(item)
      if (trait) {
        result.push([item, trait])
      }
    })
    return result
  }
}
