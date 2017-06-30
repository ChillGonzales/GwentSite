import environment from '../../environment';

class StorageManager {

  constructor(private storage: Storage) {
  }
  /**
   * Gets the value if it exists and is not expired.
   *
   * @param {string} key
   * @returns {*}
   */
  public get(key: string): any {
    let value = JSON.parse(this.storage.getItem(`${environment.applicationName}.${key}`)) as CachedValue;
    if (value) {
      if (value.expirationDate && value.expirationDate < new Date().valueOf()) {
        this.remove(key);
      } else {
        return value.value;
      }
    }
  }

  /**
   * Sets the value with an expiration.
   * 
   * @param {string} key
   * @param {*} value
   * @param {number} [expires] The number of minutes before this expires.  Default is to not expire if not specified.
   */
  public set(key: string, value: any, expires?: number): void {
    this.storage.setItem(`${environment.applicationName}.${key}`, JSON.stringify({
      expirationDate: expires ? new Date().valueOf() + expires * 60 * 1000 : undefined,
      value
    } as CachedValue));
  }

  /**
   * Removes the value.
   * 
   * @param {string} key
   */
  public remove(key: string): void {
    this.storage.removeItem(`${environment.applicationName}.${key}`);
  }

  /**
   * Clears all application-based values from local storage.
   */
  public clear(): void {
    Object.keys(this.storage)
      .filter(x => x.startsWith(environment.applicationName))
      .forEach(x => this.storage.removeItem(x));
  }

  /**
   * Removes all expired application-based values from local storage.
   */
  public flush(): void {
    Object.keys(this.storage)
      .filter(x => {
        if (x.startsWith(environment.applicationName)) {
          let cache = JSON.parse(this.storage.getItem(x)) as CachedValue;
          return cache.expirationDate && cache.expirationDate < new Date().valueOf();
        }
        return false;
      })
      .forEach(x => this.storage.removeItem(x));
  }
}

export class SessionStorageManager extends StorageManager {
  constructor() {
    super(sessionStorage);
  }
}

export class LocalStorageManager extends StorageManager {
  constructor() {
    super(localStorage);
  }
}

interface CachedValue {
  value: any;
  expirationDate: number;
}
