export class SApplicationUtil {
  // Сравнение цифровых значений, передаваемых в специальном строковом формате (пример: '1.0.7').
  // Используется для сравнения различных версий приложения.
  public static isVersionLess(current: string, other?: string): boolean {
    if (!other) return false;
    const currentVer = SApplicationUtil.versionParse(current);
    const otherVer = SApplicationUtil.versionParse(other);
    for (let i = 0; i < currentVer.length; i++) {
      if (currentVer[i] > otherVer[i]) return false;
      else if (currentVer[i] < otherVer[i]) return true;
    }
    return false;
  }

  public static versionParse(version: string) {
    return version.split('.').map(v => parseInt(v, 10));
  }
}
