import { inject } from 'aurelia-framework';
import { Router, NavigationInstruction } from 'aurelia-router';
import { DialogService, DialogOpenResult } from 'aurelia-dialog';
import { Logger, LogOptions, LogType } from '../resources/common/logger';
import { CardService, CardInfo, Artwork } from '../services/card-service';

@inject(CardService, Router, Logger)
export class Cards {
  private cards: Array<CardInfo>;
  private cardArt: Array<Artwork>;
  private overlayOn: boolean;
  private overlayedCard: Artwork;

  constructor(private cardService: CardService, private router: Router, private logger: Logger) {
  }

  public getCards(): Promise<Array<CardInfo>> {
    return this.cardService.getCardPage(40, 20)
      .catch((ex: Error) => {
        this.logger.error(ex.message, { error: ex });
      })
      .then((result: Array<CardInfo>) => {
        this.cards = result;
      }).then(() => {
        this.cardArt = this.cardService.getArtwork(this.cards);
      });
  }
  public showOverlay(uuid: string){
    for (let i of this.cardArt){
      if (i.uuid == uuid){
        this.overlayedCard = i;
      }
    }
    this.overlayOn = true;
  }
  public closeOverlay(){
    this.overlayOn = false;
  }
}
