import { inject, DOM } from 'aurelia-framework';
import * as $ from 'bootstrap';

@inject(DOM.Element)
export class BootstrapTooltipCustomAttribute {
  private element: Element;

  constructor(element: Element) {
    this.element = element;
  }

  private attached(): void {
    $(this.element).tooltip();
  }

  private detached(): void {
    $(this.element).tooltip('dispose');
  }
}
