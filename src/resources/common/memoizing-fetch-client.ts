import { HttpClient, RequestInit } from 'aurelia-fetch-client';
import { transient } from 'aurelia-dependency-injection';

@transient()
export class MemoizingFetchClient extends HttpClient {

  private responseCache: Map<string, CachedRequest>;
  private expires: number = 60;

  constructor() {
    super();
    this.responseCache = new Map<string, CachedRequest>();
  }

  public fetchCached(input: Request | string, init?: RequestInit, expires?: number): Promise<CachedResponse> {
    let key: string;
    if (input instanceof Request) {
      key = (<Request>input).url;
    } else {
      key = input as string;
    }

    let cache = this.responseCache.get(key);
    let time = new Date();
    if (!cache || cache.hasError || cache.expires.valueOf() < time.valueOf()) {
      cache = {
        promise: super.fetch(input, init)
          .catch(reason => {
            cache.hasError = true;
            throw reason;
          }).then(response => new CachedResponse(response)),
        expires: new Date(time.getTime() + (expires || this.expires) * 60 * 1000),
        hasError: false
      };
      this.responseCache.set(key, cache);
    }
    return this.responseCache.get(key).promise;
  }
}

export class CachedResponse {
  private data: any;

  constructor(private response: Response) {
  }
  public json(): Promise<any> {
    if (this.response.bodyUsed) {
      return Promise.resolve(this.data);
    } else {
      return this.response.json()
        .then(data => {
          this.data = data;
          return Promise.resolve(data);
        });
    }
  }
}

interface CachedRequest {
  promise: Promise<CachedResponse>;
  expires: Date;
  hasError: boolean;
}
