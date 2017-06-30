export class ProgressDialog {
  public model: ProgressModel;

  public activate(model: ProgressModel): void {
    model.value = model.value || 0;
    if (model.value < 0) {
      model.value = 0;
    } else if (model.value > 100) {
      model.value = 100;
    }
    this.model = model;
  }
}

export class ProgressTypeValueConverter {
  public toView(value?: ProgressType): string {
    if (value) {
      return 'bg-' + ProgressType[value];
    } else {
      return '';
    }
  }
}

export interface ProgressModel {
  message?: string;
  type?: ProgressType;
  value?: number;
  striped?: boolean;
  animated?: boolean;
}

export enum ProgressType {
  success,
  info,
  warning,
  danger
}
