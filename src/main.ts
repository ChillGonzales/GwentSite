import { Aurelia, LogManager } from 'aurelia-framework'
import environment from './environment';
import { CustomLogAppender } from './resources/common/custom-log-appender';
import { UserService, User } from './services/user-service';
import { SessionStorageManager } from './resources/common/storage-manager';
import { Cookie } from './services/cookie';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-dialog', config => {
      config.useDefaults();
      config.settings.lock = true;
    });

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(app => {

    LogManager.addAppender(aurelia.container.get(CustomLogAppender));
    LogManager.setLevel(LogManager.logLevel.debug);

    let cookieUser = Cookie.get('user');
    let manager = app.container.get(SessionStorageManager) as SessionStorageManager;
    manager.flush();

    let sessionUser = manager.get('user') as User;
    let userService = app.container.get(UserService) as UserService;
    if (cookieUser) {
      if (sessionUser && sessionUser.employeeId === cookieUser) {
        userService.setCurrentUser(sessionUser);
      } else {
        return userService.getUser(cookieUser)
          .then(user => {
            if (user) {
              userService.setCurrentUser(user);
              manager.set('user', user);
            } else {
              Cookie.set('user', '');
              manager.remove('user');
            }
          })
          .catch((ex: Error) => {
            Cookie.set('user', '');
            manager.remove('user');
            console.log(ex.message);
          })
          .then(() => app.setRoot());
      }
    } else {
      manager.remove('user');
    }
    app.setRoot();
  });
}
