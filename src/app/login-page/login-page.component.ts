import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { BackendService, JsonCredentials } from '../backend.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsersessionService } from '../usersession.service';

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


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  authority: string = "";
  matcher = new MyErrorStateMatcher(); //Para la validacion del email
  helper = new JwtHelperService(); //Para el desencriptar los JWTs.

  loginErrorMessage : string = '';

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private backendService : BackendService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private usersessionService: UsersessionService,
    ) { }

  ngOnInit(): void {
    this.spinnerService.hide();
    if(this.usersessionService.authenticationDone())
      this.router.navigateByUrl('/clients');
  }

  postCredentials(username: string, password: string): void{
    const credentials: JsonCredentials = {
      username: username,
      password: password
    };
    if(this.backendService.verifyValue("email", username)){
      this.spinnerService.show();
      this.backendService.postCredentials(credentials).subscribe(
        jwtAuthentication => {
            this.getAuthority(username, jwtAuthentication.JWT);
        }, (error) => {
          this.proccessError(error);
          this.spinnerService.hide();
        })
    } else{
      this.loginErrorMessage = "Invalid email address";
    }
  }

  //This method obtain the authority inside the JWT in the response and stores the JWT in the service for next requests.
  getAuthority(username: string, jwt: string): void{
    this.usersessionService.postJwt(jwt);
    this.usersessionService.postUsername(username);
    this.router.navigateByUrl('/clients');
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


