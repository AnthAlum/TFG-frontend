import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { BackendService, JsonCredentials } from '../backend.service';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Tile {
  color: string;
  cols: number;
  rows: number;
}

const JWT_PREFIX = "Bearer ";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  authority: string = "";
  matcher = new MyErrorStateMatcher(); //Para la validacion del email
  helper = new JwtHelperService(); //Para el desencriptar los JWTs.

  loginErrorMessage : any = undefined;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private backendService : BackendService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  postCredentials(username: string, password: string): void{
    const credentials: JsonCredentials = {
      username: username,
      password: password
    };
    if(this.backendService.verifyValue("email", username)){
      this.backendService.postCredentials(credentials)
        .subscribe(jwtAuthentication => {
            this.getAuthority(jwtAuthentication.JWT);
            this.checkAuthority();
        }, (error) => {
          this.proccessError(error);
        })
    } else{
      this.loginErrorMessage = "Invalid email address";
    }
  }

  //This method obtain the authority inside the JWT in the response and stores the JWT in the service for next requests.
  getAuthority(jwt: string): void{
    const tokenInfo = this.helper.decodeToken(jwt.replace(JWT_PREFIX, ""));
    this.authority = tokenInfo.authorities[0].authority;
    this.backendService.postJwt(jwt);
  }

  checkAuthority(): void{
    if(this.authority.localeCompare("ROLE_ADMIN") === 0)
      this.router.navigateByUrl('/merchants');
    if(this.authority.localeCompare("ROLE_USER") === 0)
      this.router.navigateByUrl('/user'); 
  }

  proccessError(error: HttpErrorResponse): void{
    if(error.status === 403){
      this.loginErrorMessage = "User with that email was not found";
    }
    if(error.status === 500){
      this.loginErrorMessage = "Server execution error";
    }
  }
}


