import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BackendClientsService } from './backend-clients.service';
import { BackendMeetingsService } from './backend-meetings.service';
import { BackendService } from './backend.service';
import { LoadingService } from './loading.service';

const JWT_PREFIX = "Bearer ";

@Injectable({
  providedIn: 'root'
})
export class UsersessionService {

  jwt: string;
  role: string = "";
  id: number = 0;
  username: string;
  jwtHelperService = new JwtHelperService(); //Para el desencriptar los JWTs.
  constructor(
    private merchantsService: BackendService,
    private clientsService: BackendClientsService,
    private meetingsService: BackendMeetingsService,
    private loadingService: LoadingService,
  ) { }

  authenticationDone(): boolean{
    if(localStorage.getItem('token') != null && localStorage.getItem('username') != null){ //Ha sido autenticado
      this.loadJwt();
      this.loadUsername();
      return true;
    }
    return false;
  }

  loadJwt(): void{
    this.jwt = localStorage.getItem('token')!;
    const tokenInfo = this.jwtHelperService.decodeToken(this.jwt.replace(JWT_PREFIX, ""));
    this.role = tokenInfo.authorities[0].authority;
    this.merchantsService.httpOptions.headers = this.merchantsService.httpOptions.headers.set('Authorization', this.jwt);
    this.clientsService.httpOptions.headers = this.clientsService.httpOptions.headers.set('Authorization', this.jwt);
    this.meetingsService.httpOptions.headers = this.meetingsService.httpOptions.headers.set('Authorization', this.jwt);

  }

  loadUsername(): void{
    this.loadingService.show();
    this.merchantsService.getMerchantByEmail(localStorage.getItem('username')!).subscribe(merchant => {
      this.id = merchant.idMerchant;
      this.role = merchant.idRole === 0 ? 'ROLE_ADMIN' : 'ROLE_USER';
      this.loadingService.hide();
    });
  }

  postJwt(jwt: string): void{
    localStorage.setItem('token', jwt);
    this.jwt = jwt;
    const tokenInfo = this.jwtHelperService.decodeToken(this.jwt.replace(JWT_PREFIX, ""));
    this.role = tokenInfo.authorities[0].authority;
    this.merchantsService.httpOptions.headers = this.merchantsService.httpOptions.headers.set('Authorization', this.jwt);
    this.clientsService.httpOptions.headers = this.clientsService.httpOptions.headers.set('Authorization', this.jwt);
    this.meetingsService.httpOptions.headers = this.meetingsService.httpOptions.headers.set('Authorization', this.jwt);
  }

  postUsername(username: string): void{
    localStorage.setItem('username', username);
    this.loadingService.show();
    this.merchantsService.getMerchantByEmail(localStorage.getItem('username')!).subscribe(merchant => {
      this.id = merchant.idMerchant;
      this.loadingService.hide();
    });
  }

  logout(): void{
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.jwt = "JWT";
    this.id = 0;
    this.role = '';
    this.merchantsService.httpOptions.headers = this.merchantsService.httpOptions.headers.delete('Authorization');
    this.clientsService.httpOptions.headers = this.clientsService.httpOptions.headers.delete('Authorization');
    this.meetingsService.httpOptions.headers = this.meetingsService.httpOptions.headers.delete('Authorization');
  }

  isAdmin(): boolean{
    return this.role.localeCompare('ROLE_ADMIN') === 0;
  }

  getId(): number{
    return this.id;
  }
}
