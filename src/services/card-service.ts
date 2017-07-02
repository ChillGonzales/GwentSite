import { inject } from 'aurelia-framework';
import { MemoizingFetchClient } from '../resources/common/memoizing-fetch-client';
import { json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';

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
}
