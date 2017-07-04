import { inject } from 'aurelia-framework';
import { Router, NavigationInstruction } from 'aurelia-router';
import { DialogService, DialogOpenResult } from 'aurelia-dialog';
import { Logger, LogOptions, LogType } from '../resources/common/logger';
import { CardService, PageResponse, BasicInfo } from '../services/card-service';

@inject(CardService, Router, Logger)
export class Cards {
  private cards: Array<BasicInfo>;

  constructor(private cardService: CardService, private router: Router, private logger: Logger) {
  }

  public getCards(): Promise<PageResponse> {
    return this.cardService.getCardPage(20, 0)
      .catch((ex: Error) => {
        this.logger.error(ex.message, { error: ex });
      })
      .then((result: PageResponse) => {
        console.log("%O", result);
        this.cards = result.results;
      })
  }
}
