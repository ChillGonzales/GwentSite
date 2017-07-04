import { inject } from 'aurelia-framework';
import { MemoizingFetchClient } from '../resources/common/memoizing-fetch-client';
import { json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpException } from '../resources/common/http-exception';

@inject(MemoizingFetchClient, EventAggregator)
export class CardService{
  private cardEndpoint: string = 'cards';
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
  public getCardPage(count: number, offset: number) : Promise<Array<CardInfo>> {
    return this.http.fetchCached(this.cardEndpoint + "?limit=" + count + "&offset=" + offset )
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
          let retVal: Array<CardInfo> = [];
          for (let card of result.results){
            let splitLink = card.href.split("/");
            let bi: CardInfo = {
              name: card.name,
              uuid: splitLink[splitLink.length - 1]
            }
            retVal.push(bi);
          }
          return retVal;
        }
      });
  }
  public getArtwork(cards: Array<CardInfo>) : Array<Artwork>{
    let artArray: Artwork[] = [];
    for (let card of cards){
      let response = this.http.fetchCached(this.cardEndpoint + "/" + card.uuid + "/" + this.variationEndpoint)
        .then<VariationDetail[]>(response => {
          return response.json();
        },
        (response: Response) => {
          return response.json()
          .then((ex: HttpException) => {
            throw new Error(ex.exceptionMessage);
          });
        }).then((result: VariationDetail[]) => {
          let art: Artwork = {
            name: card.name,
            thumbnailImage: result[0].art.thumbnailImage
          }
          artArray.push(art);
        });
    }
    return artArray;
  }
  // private getCardData(cardList: Array<BasicInfo>) : Promise<CardDetail> {
  // }
}

export interface CardInfo{
  name: string;
  uuid: string;
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
export interface Artwork{
  name: string;
  thumbnailImage: string;
}
export interface CardDetail{
  categories: Array<BasicInfo>;
  faction: BasicInfo;
  flavor: string;
  group: BasicInfo;
  href: string;
  info: string;
  name: string;
  positions: string[];
  strength: number;
  uuid: string;
  variations: Array<Variations>;
}
export interface Variations{
  href: string;
  rarity: BasicInfo;
}
export interface Art{
  thumbnailImage: string;
}
export interface ArtLevel{
  normal: string;
  premium: string;
}
export interface VariationDetail{
  art: Art;
  availability: string;
  craft: ArtLevel;
  href: string;
  mill: ArtLevel;
  rarity: BasicInfo;
  uuid: string;
}

