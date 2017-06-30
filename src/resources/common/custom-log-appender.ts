import {inject} from 'aurelia-framework';
import {AppLoggingService, LogEntry, LogEntryLevel} from '../../services/app-logging-service';

@inject(AppLoggingService)
export class CustomLogAppender {

  constructor(private appLoggingService: AppLoggingService) { }

  public debug(logger, message, ...rest): void {
    console.debug(`DEBUG [${logger.id}] ${message}`, ...rest);
  }
  public info(logger, message, ...rest): void {
    let request: LogEntry = {
      level: LogEntryLevel.Info,
      message
    };
    this.appLoggingService.log([request]);
  }
  public warn(logger, message, ...rest): void {
    let request: LogEntry = {
      level: LogEntryLevel.Warn,
      message
    };
    this.appLoggingService.log([request]);
  }
  public error(logger, message, ...rest): void {
    let request: LogEntry = {
      level: LogEntryLevel.Error,
      message
    };
    this.appLoggingService.log([request]);
  }
}
