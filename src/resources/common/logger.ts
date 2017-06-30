import { bindable, inject } from 'aurelia-framework';
import { LogManager } from 'aurelia-framework';

let logger = LogManager.getLogger('logger');

export class Logger {
  /**
   * success()
   * By default this function will send a toast and will NOT log the specified message
   * The defaults can be overridden using the 'LogOptions' object
   * @param {string} message - message to be displayed
   * @param {LogOptions} [options] - overrides for defaults
   * @returns
   */
  public success(message: string, options?: LogOptions): void {
    options = options || {} as LogOptions;
    options.type = options.type || [LogType.toast];

    if (options.type.some(x => x === LogType.log)) {
      logger.info(this.formatErrorMessage(message, options.title, options.error, options.parameters));
    }
    if (options.type.some(x => x === LogType.toast)) {
      this.showToast(message, "alert-success");
    }
  }

  /**
   * warning()
   * By default this function will send a toast and log the specified message
   * The defaults can be overridden using the 'LogOptions' object
   * @param {string} message - message to be displayed
   * @param {LogOptions} [options] - overrides for defaults
   * @returns
   */
  public warning(message: string, options?: LogOptions): void {
    options = options || {} as LogOptions;
    options.type = options.type || [LogType.toast, LogType.log];

    if (options.type.some(x => x === LogType.log)) {
      logger.warn(this.formatErrorMessage(message, options.title, options.error, options.parameters));
    }
    if (options.type.some(x => x === LogType.toast)) {
      this.showToast(message, "alert-warning");
    }
  }

  /**
   * error()
   * By default this function will send a toast and log the specified message
   * The defaults can be overridden using the 'LogOptions' object
   * @param {string} message - message to be displayed
   * @param {LogOptions} [options] - overrides for defaults
   * @returns
   */
  public error(message: string, options?: LogOptions): void {
    options = options || {} as LogOptions;
    options.type = options.type || [LogType.toast, LogType.log];

    if (options.type.some(x => x === LogType.log)) {
      logger.error(this.formatErrorMessage(message, options.title, options.error, options.parameters));
    }
    if (options.type.some(x => x === LogType.toast)) {
      this.showToast(message, "alert-danger");
    }
  }

  private showToast(message: string, alertClass: string, timeout: number = 3000) {
    let div = document.createElement("div");
    div.setAttribute("class", "toast alert " + alertClass);
    div.setAttribute("role", "alert")
    div.textContent = message;
    document.getElementsByTagName('body')[0].appendChild(div);
    setTimeout(() => {
      div.parentNode.removeChild(div);
    }, timeout);
  }

  /**
   * formatErrorMessage()
   * This is used to format the message for logging
   * @private
   * @param {string} [message]
   * @param {string} [title]
   * @param {Exception} [error]
   * @param {*} [parameters]
   * @returns {string}
   */
  private formatErrorMessage(message?: string, title?: string, error?: Error, parameters?: any): string {
    let formattedError: string = "";
    if (title) {
      formattedError = title;
    }
    if (message) {
      if (formattedError) {
        formattedError = `${formattedError}\r\n${message}`;
      } else {
        formattedError = message;
      }
    }
    if (parameters) {
      formattedError = `${formattedError}\r\nParameters:\r\n${JSON.stringify(parameters, null, 2)}`;
    }

    if (error && error.stack) {
      formattedError = `${formattedError}\r\n\r\n${error.stack}`;
    }
    return formattedError;
  }
}

export enum LogType {
  log,
  toast
}

/**
 * Logging will log the provided title, message, error, and parameters
 * The toast will show the title and the message.
 * @export
 * @interface LogOptions
 */
export interface LogOptions {
  type?: LogType[];
  title?: string;
  error?: Error;
  parameters?: any;
}

enum Severity {
  success,
  info,
  warn,
  error
}
