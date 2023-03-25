export class BidirectionalMap<K1, K2> {
  private readonly map1: Map<K1, K2>;

  private readonly map2: Map<K2, K1>;

  private readonly errorOnExist: boolean = false;

  public constructor(errorOnExist: boolean) {
    this.errorOnExist = errorOnExist;
    this.map1 = new Map();
    this.map2 = new Map();
  }

  public get size(): number {
    return this.map1.size;
  }

  public get isEmpty(): boolean {
    return this.size === 0;
  }

  public clear(): void {
    this.map1.clear();
    this.map2.clear();
  }

  public hasKey1(k1: K1): boolean {
    return this.map1.has(k1);
  }

  public hasKey2(k2: K2): boolean {
    return this.map2.has(k2);
  }

  public getKey1(k2: K2): K1 | undefined {
    return this.map2.get(k2);
  }

  public getKey2(k1: K1): K2 | undefined {
    return this.map1.get(k1);
  }

  public deleteByKey1(k1: K1): boolean {
    if (!this.hasKey1(k1)) {
      return false;
    }
    const k2 = this.getKey2(k1);
    this.map2.delete(k2);
    return this.map1.delete(k1);
  }

  public deleteByKey2(k2: K2): boolean {
    if (!this.hasKey2(k2)) {
      return false;
    }
    const k1 = this.getKey1(k2);
    this.map1.delete(k1);
    return this.map2.delete(k2);
  }

  public set(k1: K1, k2: K2): void {
    if (this.hasKey1(k1) || this.hasKey2(k2)) {
      if (this.errorOnExist) {
        throw new Error('Key or Value already exists');
      }
    }
    this.map1.set(k1, k2);
    this.map2.set(k2, k1);
  }

  public entries(): IterableIterator<[K1, K2]> {
    return this.map1.entries();
  }

  public keys1(): IterableIterator<K1> {
    return this.map1.keys();
  }

  public keys2(): IterableIterator<K2> {
    return this.map2.keys();
  }
}
