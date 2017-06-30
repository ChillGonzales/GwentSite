import { AppLoggingService, LogEntry, LogEntryDescriptor } from './app-logging-service';
import { MemoizingFetchClient } from '../resources/common/memoizing-fetch-client';
import { IMock, Mock, It, Times } from "typemoq";

describe('The app logging service', () => {
  let http: IMock<MemoizingFetchClient>;

  beforeEach(done => {
    http = Mock.ofType(MemoizingFetchClient);
    http.setup(x => x.configure(It.isAny()));
    done();
  });

  it('can be instantiated.', done => {
    expect(() => new AppLoggingService(http.object)).not.toThrow();
    http.verify(x => x.configure(It.isAny()), Times.once());
    done();
  });

  it('can log.', done => {
    let response = Mock.ofType(Response);

    response.setup(x => x.json()).returns(() => Promise.resolve());

    http.setup(x => x.fetch(It.isValue("log"), It.isAny())).returns(() => Promise.resolve(response.object)).verifiable(Times.once());
    let service = new AppLoggingService(http.object);

    let entries: LogEntry[] = [{
      loggerName: "",
      hostName: "",
      applicationVersion: "",
      applicationName: "",
      applicationInstanceName: "",
      eventSource: "",
      timeStamp: new Date(),
      level: 0,
      message: "",
      descriptors: [],
      descriptorDelimiter: "",
    }];

    service.log(entries)
      .then(() => {
        response.verifyAll();
        http.verifyAll();
        done();
      }, ex => {
        fail(ex);
        done();
      });
  });

});
