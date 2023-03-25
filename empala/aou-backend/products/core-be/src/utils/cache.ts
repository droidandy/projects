interface CacheData<CacheValueType> {
  value: CacheValueType;
  dateNumber: number;
}

export class Cache<CacheKeyType, CacheValueType> {
  private cache: Map<CacheKeyType, CacheData<CacheValueType>> = new Map();

  public get(key: CacheKeyType): CacheValueType | null {
    const data: CacheData<CacheValueType> = this.cache.get(key);
    if (data && data.dateNumber === this.getCurrentDate()) {
      return data.value;
    }
    return null;
  }

  public set(key: CacheKeyType, value: CacheValueType): void {
    this.cache.set(key, {
      value,
      dateNumber: this.getCurrentDate(),
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }

  private getCurrentDate(): number {
    const currentDate = new Date();
    return currentDate.setHours(0, 0, 0, 0);
  }
}
