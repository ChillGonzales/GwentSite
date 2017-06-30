export class Utility {
  public static arrayIntersection<T>(array1: T[], array2: T[]): T[] {
    return array1.filter(i => array2.indexOf(i) !== -1);
  };

  public static arraysHaveIntersection<T>(array1: T[], array2: T[]): boolean {
    if (!array1 || !array2) {
      return false;
    }

    return array2.some(v => array1.indexOf(v) !== -1);
  };
}
