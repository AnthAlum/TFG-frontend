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

  jwt: string = "JWT";
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
    if(this.loadJwt() && this.loadUsername()){
      return true;
    }
    if(this.jwt.localeCompare("JWT") === 0) //Si nuestro JWT no tiene un nuevo token asignado entonces es porque no estamos autenticados.
      return false;
  }

  loadJwt(): string{
    this.jwt = localStorage.getItem('token')!;
    const tokenInfo = this.jwtHelperService.decodeToken(this.jwt.replace(JWT_PREFIX, "")); //TODO: HAY UN ERROR CON ESTO
    this.role = tokenInfo.authorities[0].authority;
    this.merchantsService.httpOptions.headers = this.merchantsService.httpOptions.headers.set('Authorization', this.jwt);
    this.clientsService.httpOptions.headers = this.clientsService.httpOptions.headers.set('Authorization', this.jwt);
    this.meetingsService.httpOptions.headers = this.meetingsService.httpOptions.headers.set('Authorization', this.jwt);
    return this.jwt;
  }

  loadUsername(): string{
    this.username = localStorage.getItem('username')!;
    this.loadingService.show();
    this.merchantsService.getMerchantByEmail(this.username).subscribe(
      merchant => {
        this.id = merchant.idMerchant;
        this.loadingService.hide();
      }
    );
    return this.username;
  }

  postJwt(jwt: string): void{
    localStorage.setItem('token', jwt);
    this.merchantsService.httpOptions.headers = this.merchantsService.httpOptions.headers.set('Authorization', this.jwt);
    this.clientsService.httpOptions.headers = this.clientsService.httpOptions.headers.set('Authorization', this.jwt);
    this.meetingsService.httpOptions.headers = this.meetingsService.httpOptions.headers.set('Authorization', this.jwt);
  }

  postUsername(username: string): void{
    localStorage.setItem('username', username);
  }

  logout(): void{
    localStorage.removeItem('token');
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
