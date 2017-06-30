import { UserService } from './user-service';
import { CachedResponse, MemoizingFetchClient } from '../resources/common/memoizing-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Mock, Times, It, IMock } from 'typemoq';

describe('The user service', () => {
  let http: IMock<MemoizingFetchClient>;
  let eventAggregator: IMock<EventAggregator>;

  beforeEach(done => {
    http = Mock.ofType(MemoizingFetchClient);
    http.setup(x => x.configure(It.isAny()));

    eventAggregator = Mock.ofType(EventAggregator);
    eventAggregator.setup(x => x.publish(It.isAny()));
    done();
  });

  it('can be instantiated.', done => {
    expect(() => new UserService(http.object, eventAggregator.object)).not.toThrow();
    http.verify(x => x.configure(It.isAny()), Times.once());
    done();
  });

  it('can fetch a user.', done => {
    http.setup(x => x.fetchCached(It.isValue('user/username?includeGroups=true'))).returns(() => new Promise<CachedResponse>(responseResolve => {
      let response: IMock<CachedResponse> = Mock.ofType(CachedResponse);
      response.setup(x => x.json()).returns(() => new Promise<any>(jsonResolve => jsonResolve({ employeeId: '12345', username: 'username' })));
      responseResolve(response.object);
    }));
    let service = new UserService(http.object, eventAggregator.object);
    service.getUser('username')
      .then(user => {
        expect(user.employeeId).toBe('12345');
        expect(user.username).toBe('username');
        done();
      }, ex => fail(ex));
  });

  it('will return undefined for user not found.', done => {
    http.setup(x => x.fetchCached(It.isValue('user/badusername?includeGroups=true'))).returns(() => new Promise<CachedResponse>(responseResolve => {
      let response: IMock<CachedResponse> = Mock.ofType(CachedResponse);
      response.setup(x => x.json()).returns(() => new Promise<any>(jsonResolve => jsonResolve(undefined)));
      responseResolve(response.object);
    }));
    let service = new UserService(http.object, eventAggregator.object);
    service.getUser('badusername')
      .then(user => {
        expect(user).toBeUndefined();
        done();
      }, ex => fail(ex));
  });

  it('will authenticate a valid password.', done => {
    http.setup(x => x.fetch(It.isValue('authenticate'), It.isAny())).returns(() => new Promise<Response>(responseResolve => {
      let response: IMock<Response> = Mock.ofType(Response);
      response.setup(x => x.json()).returns(() => new Promise<any>(jsonResolve => jsonResolve(true)));
      responseResolve(response.object);
    }));
    let service = new UserService(http.object, eventAggregator.object);
    service.authenticate('username', 'goodPassword')
      .then(result => {
        expect(result).toBeTruthy();
        done();
      }, ex => fail(ex));
  });

  it('will reject an invalid password.', done => {
    http.setup(x => x.fetch(It.isValue('authenticate'), It.isAny())).returns(() => new Promise<Response>(responseResolve => {
      try {
        let response: IMock<Response> = Mock.ofType(Response);
        response.setup(x => x.json()).returns(() => new Promise<any>(jsonResolve => jsonResolve(false)));
        responseResolve(response.object);
      } catch (ex) {
        console.log(ex);
        responseResolve(null);
      }
    }));
    let service = new UserService(http.object, eventAggregator.object);
    service.authenticate('username', 'badPassword')
      .then(result => {
        expect(result).not.toBeTruthy();
        done();
      }, ex => fail(ex));
  });

});
