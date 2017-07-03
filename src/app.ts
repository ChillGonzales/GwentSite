import { inject } from 'aurelia-framework';
import { Router, RouterConfiguration, NavigationInstruction, Redirect } from 'aurelia-router';
import environment from './environment';
import { UserService, User, CurrentUserChanged } from './services/user-service';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { Logger, LogOptions, LogType } from './resources/common/logger';
import { Utility } from './resources/common/utility';

@inject(EventAggregator, UserService)
export class App {
  public router: Router;
  public environment: any;
  public currentUser: User;
  private eventAggregator: EventAggregator;
  private userService: UserService;
  private loginChangedSubscription?: Subscription;

  constructor(eventAggregator: EventAggregator, userService: UserService) {
    this.eventAggregator = eventAggregator;
    this.userService = userService;
  }

  private attached(): void {
    this.environment = environment;
    this.loginChangedSubscription = this.eventAggregator.subscribe(CurrentUserChanged, (message: CurrentUserChanged) => {
      this.updateUser(this.userService.currentUser);
    })
  }

  private detached(): void {
    if (this.loginChangedSubscription) {
      this.loginChangedSubscription.dispose();
      this.loginChangedSubscription = undefined;
    }
  }

  private configureRouter(config: RouterConfiguration, router: Router): void {
    config.title = "Unified Configuration";
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: ['', 'index'], name: 'home', moduleId: 'routes/home', nav: false, title: 'Home' },
      { route: 'login', name: 'login', moduleId: 'routes/login/login', nav: false, title: 'Login' },
      { route: 'cards', name: 'cards', moduleId: 'routes/cards', nav: false, title: 'Cards' }
    ]);
    this.router = router;
  }

  private updateUser(user: User): void {
    this.currentUser = user;
    if (!this.currentUser) {
      this.router.navigateToRoute("home");
    }
  }

  private logout(): void {
    this.userService.setCurrentUser(undefined);
  }
}

export interface Next {
  (): any;
  cancel?: (redirect?: Redirect) => any;
}

@inject(UserService, Logger)
export class AuthorizeStep {

  constructor(private userService: UserService, private logger: Logger) { }

  public run(navigationInstruction: NavigationInstruction, next: Next): any {
    next.apply("");
    if (navigationInstruction.config.settings.requiredRoles) {
      if (navigationInstruction.config.settings.requiredRoles.length > 0) {
        if (!this.userService.currentUser) {
          return next.cancel(new Redirect('login?returnUrl=' + navigationInstruction.fragment));
        } else if (!Utility.arraysHaveIntersection(this.userService.currentUser.roles.map(x => x.userRole), navigationInstruction.config.settings.requiredRoles)) {
          this.logger.warning("You do not have permission to access this page.");
          return next.cancel();
        }
      }
    }
    return next();
  }
}
