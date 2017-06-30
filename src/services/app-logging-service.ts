import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { MemoizingFetchClient } from '../resources/common/memoizing-fetch-client';
import * as path from 'aurelia-path';
import { HttpException } from '../resources/common/http-exception';
import environment from '../environment';

@inject(MemoizingFetchClient)
export class AppLoggingService {

  constructor(private http: MemoizingFetchClient) {
    if (http) {
      http.configure(config => {
        config
          .withBaseUrl(environment.serviceHostBaseUrl + 'utility/messageloggingweb/api/v1/')
          .useStandardConfiguration();
      });
    }
  }

  public log(entries: LogEntry[]): Promise<void> {
    let updatedEntries = entries.map(entry => {
      entry.hostName = environment.hostName;
      entry.applicationName = environment.applicationName;
      entry.loggerName = environment.applicationName;
      entry.timeStamp = new Date();
      return entry;
    });

    return this.http.fetch('log', {
      method: 'post',
      body: json({ entries: updatedEntries })
    }).then(response => Promise.resolve(),
      (response: Response) => {
        return response.json()
          .then((ex: HttpException) => {
            throw new Error(ex.exceptionMessage);
          });
      });
  }

}

export interface LogEntry {
  loggerName?: string;
  hostName?: string;
  applicationVersion?: string;
  applicationName?: string;
  applicationInstanceName?: string;
  eventSource?: string;
  timeStamp?: Date;
  level: number;
  message: string;
  descriptors?: LogEntryDescriptor[];
  descriptorDelimiter?: string;
}

export interface LogEntryDescriptor {
  key: string;
  value: string;
}

export enum LogEntryLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5
}
