import { inject } from 'aurelia-framework';
import { Router, NavigationInstruction } from 'aurelia-router';
import { DialogService, DialogOpenResult } from 'aurelia-dialog';
import { Logger, LogOptions, LogType } from '../resources/common/logger';
import { CardService, PageResponse } from '../services/card-service';

@inject(CardService, Router, Logger)
export class GetCards {
  private cardPage: PageResponse;

  constructor(private cardService: CardService, private router: Router, private logger: Logger) {
  }

  public getCards(): Promise<PageResponse> {
    let promise: Promise<PageResponse>;
    return this.cardService.getCardPage(20, 0)
      .catch((ex: Error) => {
        this.logger.error(ex.message, { error: ex });
      })
      .then((result: PageResponse) => {
        this.cardPage = result;
      })
  }
}
