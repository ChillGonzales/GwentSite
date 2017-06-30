export class Cookie {

  public static get(name: string): string {
    let cookies = document.cookie.split('; ');
    for (let i = cookies.length - 1; i >= 0; i--) {
      let parts = cookies[i].split('=');
      if (this.decode(parts[0]) === this.decode(name)) {
        return this.decode(parts[1]);
      }
    }
  }

  public static set(name: string, value: string, expires?: Date): void {
    let result = `${this.encode(name)}=${this.encode(value)}`;
    if (expires) {
      document.cookie += `; expires=${expires.toUTCString()}`;
    }

    document.cookie = result;
  }

  private static encode(value: string): string {
    try {
      return encodeURIComponent(value);
    } catch (ex) {
      return undefined;
    }
  }

  private static decode(value: string): string {
    try {
      return decodeURIComponent(value);
    } catch (ex) {
      return undefined;
    }
  }
}
