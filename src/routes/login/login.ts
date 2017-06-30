import { inject } from 'aurelia-framework';
import { Router, NavigationInstruction } from 'aurelia-router';
import { DialogService, DialogOpenResult } from 'aurelia-dialog';
import { Logger, LogOptions, LogType } from '../../resources/common/logger';
import { ProgressDialog } from '../../resources/common/progress-dialog/progress-dialog';
import { UserService } from '../../services/user-service';

@inject(UserService, Router, Logger, DialogService)
export class Login {
  public username: string;
  public password: string;

  constructor(private userService: UserService, private router: Router, private logger: Logger, private dialogService: DialogService) {
  }

  public canDeactivate(): boolean {
    return !this.dialogService.hasActiveDialog;
  }

  public submit(): Promise<void> {
    let promise: Promise<void>;
    if (this.username && this.password) {
      return this.submitUsername(this.username, this.password)
        .catch((ex: Error) => {
          this.logger.error(ex.message, { error: ex });
        });
    }
    return Promise.resolve();
  }

  private submitUsername(username: string, password: string): Promise<void> {
    let progress = {
      message: 'Authenticating',
      value: 0
    };

    return this.dialogService.open({
      viewModel: ProgressDialog,
      model: progress
    })
    .then((result: DialogOpenResult) => {
      return this.userService.authenticate(username, password)
        .then(isValid => {
          progress.value = 25;
          if (isValid) {
            progress.message = 'Logging In';
            progress.value = 50;
            return this.userService.getUser(username);
          } else {
            throw new Error('Invalid username or password.');
          }
        })
        .then(user => result.controller.close(true)
          .then(() => {
            if (user) {
              if (user.roles.length > 0) {
                progress.value = 75;
                this.userService.setCurrentUser(user);
                progress.value = 100;
                this.router.navigate('index');
              } else {
                this.logger.warning('User not authorized to operate this application.');
              }
            } else {
              this.logger.warning('User not found.');
            }
          }))
        .catch((ex: Error) => result.controller.close(true)
          .then(() => {
            this.logger.error(ex.message, { error: ex });
          }));
    });
  }

}
