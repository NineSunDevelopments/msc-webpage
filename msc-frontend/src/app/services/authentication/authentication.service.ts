import {HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiService} from '@app/services/api/api.service';
import {AppService} from '@app/services/app/app.service';
import {User} from '@shared/types/user';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private dataLink: string = 'auth';

  constructor(
    private appService: AppService,
    private apiService: ApiService,
  ) {
  }

  public login(email: string, password: string, authenticateByMail: boolean): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      const authRequest = {
        email: email,
        username: email,
        password: password
      };

      if (authenticateByMail) delete authRequest.username;
      if (!authenticateByMail) delete authRequest.email;

      this.apiService.post<User>(this.dataLink, authRequest)
        .then(user => {
          console.log("Setting user")
          this.appService.mutate({user}).then(() => resolve(user));
        }).catch(reject);
    });
  }

  public logout(notifyBackend = true) {
    return new Promise(async (resolve, reject) => {
      if (notifyBackend)
        this.apiService.delete(this.dataLink).then();

      resolve(this.appService.reset());
    });
  }

  public checkPasswordResetToken(email: string, token: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.get<boolean>(`${this.dataLink}/check-password-reset-token/${email}/${token}`).then(result => {
        resolve(result);
      });
    });
  }

  public sendRestoreLink(email: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.get<boolean>(`${this.dataLink}/request-password-reset/${email}`).then(result => {
        resolve(result);
      });
    });
  }

  public resetPassword(email: string, token: string, newPassword: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.post<boolean>(`${this.dataLink}/reset-password`, {email, token, newPassword}).then(result => {
        resolve(result);
      });
    });
  }

  public authenticateAppToken(userId: string, appToken: string) {
    let headers = new HttpHeaders();
    headers = headers.append('auth-id', userId);
    headers = headers.append('app-token', appToken);

    return new Promise<User>((resolve, reject) => {
      return this.apiService.post<User>(this.dataLink, {}, {headers}).then(user => {
        return this.appService.mutate({user});
      });
    });

  }
}
