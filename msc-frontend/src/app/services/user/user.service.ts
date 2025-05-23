import { Injectable, Injector } from '@angular/core';
import { DataService } from '@app/services/data-service';
import { User } from '@shared/types/user';


@Injectable({ providedIn: 'root' })
export class UserService extends DataService<User> {

  constructor(
    injector: Injector,
  ) {
    super({
      link: '/user',
      injector,
    });
  }

  public update(data: User): Promise<User[]> {
    return super.update(data);
  };

  public load(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      super.load()
        .then(resolve)
        .catch(reject);
    });
  }

  public loadSingle(id: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.api.get<User>(this.dataLink + '/' + id)
        .then((result: User) => {
          result.token = this.appService.state.user.token;
          this.appService.mutate({
            user: result,
            userBase: this.appService.state.userBase.map((user: User) => user._id === result._id ? result : user),
          });
          resolve(result);
        })
        .catch((error: any) => reject(error));
    });
  }
}
