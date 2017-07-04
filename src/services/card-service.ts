import { inject } from 'aurelia-framework';
import { MemoizingFetchClient } from '../resources/common/memoizing-fetch-client';
import { json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpException } from '../resources/common/http-exception';

@inject(MemoizingFetchClient, EventAggregator)
export class CardService{
  private cardPageEndpoint: string = 'cards';
  private variationEndpoint: string = 'variations';

  constructor(private http: MemoizingFetchClient, private eventAggregator: EventAggregator) {
    if (http) {
      http.configure(config => {
        config
          .withBaseUrl('https://api.gwentapi.com/v0/')
          .useStandardConfiguration();
      });
    }
  }
  public getCardPage(count: number, offset: number) : Promise<PageResponse> {
    return this.http.fetchCached(this.cardPageEndpoint + "?limit=" + count + "&offset=" + offset )
      .then<PageResponse>(response => {
        return response.json();
      },
      (response: Response) => {
        return response.json()
          .then((ex: HttpException) => {
            throw new Error(ex.exceptionMessage);
          });
      }).then((result: PageResponse) => {
        if (result) {
          return result;
        }
      });
  }
}

export interface BasicInfo{
  name: string;
  href: string;
}
export interface PageResponse{
  count: number;
  next: string;
  results: Array<BasicInfo>;
}
