import { inject } from 'aurelia-framework';
import { MemoizingFetchClient } from '../resources/common/memoizing-fetch-client';
import { json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Utility } from '../resources/common/utility';
import { HttpException } from '../resources/common/http-exception';

@inject(MemoizingFetchClient, EventAggregator)
export class UserService {
  public currentUser: User;
  private logoutHandler: () => void;

  constructor(private http: MemoizingFetchClient, private eventAggregator: EventAggregator) {
    // TODO: replace with appropriate config
    if (http) {
      http.configure(config => {
        config
          .withBaseUrl('http://zvm-msgdev2/SecurityWeb/api/v1/')
          .useStandardConfiguration();
      });
    }
    this.logoutHandler = () => this.handleLogout();
  }

  public getUser(userId: string): Promise<User> {
    let includeGroups = false;
    if (!parseInt(userId, undefined)) {
      includeGroups = true;
    }

    return this.http.fetchCached('user/' + userId + '?includeGroups=' + includeGroups)
      .then<Identity>(response => {
        return response.json();
      },
      (response: Response) => {
        return response.json()
          .then((ex: HttpException) => {
            throw new Error(ex.exceptionMessage);
          });
      }).then((result: Identity) => {
        if (result) {
          let user: User = {
            emailAddress: result.emailAddress,
            employeeId: result.employeeId,
            firstName: result.firstName,
            lastName: result.lastName,
            username: result.username,
            roles: this.mapUserRole(result.roles)
          };
          return user;
        }
      });
  }

  public setCurrentUser(value: User): void {
    this.currentUser = value;
    this.eventAggregator.publish(new CurrentUserChanged());
  }

  public authenticate(username: string, password: string): Promise<boolean> {
    return this.http.fetch('authenticate', {
      method: 'post',
      body: json({ username, password })
    }).then<boolean>(response => {
      return response.json();
    },
      (response: Response) => {
        return response.json()
          .then((ex: HttpException) => {
            throw new Error(ex.exceptionMessage);
          });
      });
  }

  public getAllRoles(): CombinedUserRole[] {
    return this.mapUserRole(["MESWeb Administrator"]);
  }

  private handleLogout(): void {
    this.setCurrentUser(undefined);
  }

  private mapUserRole(roles: string[]): CombinedUserRole[] {
    let result = new Array<CombinedUserRole>();
    if (Utility.arraysHaveIntersection(roles, ["MESWeb Administrator"])) {
      result.push({ userRole: UserRole.Administrator, activeDirectoryRoles: ["MESWeb Administrator"] });
    }
    if (Utility.arraysHaveIntersection(roles, ["JIT Mast"])) {
      result.push({ userRole: UserRole.JITMast, activeDirectoryRoles: ["JIT Mast"] });
    }
    return result;
  }
}

interface Identity {
  employeeId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  roles?: string[];
}

export interface User {
  employeeId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  roles?: CombinedUserRole[];
}

export enum UserRole {
  Administrator,
  JITMast
}

export interface CombinedUserRole {
  userRole: UserRole;
  activeDirectoryRoles?: string[];
}

export class CurrentUserChanged { }
