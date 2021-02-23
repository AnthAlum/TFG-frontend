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
    if(this.verifyCredentials(username, password)){
      try {
        this.backendService.postCredentials(credentials)
        .subscribe(jwtAuthentication => {
            const jwt = jwtAuthentication.replace(JWT_PREFIX, "");
            const tokenInfo = this.helper.decodeToken(jwt);
            this.authority = tokenInfo.authorities[0].authority;
            this.backendService.postJwt(jwtAuthentication);
            if(this.authority.localeCompare("ROLE_ADMIN") === 0)
              this.navigateToAdminComponent();
            if(this.authority.localeCompare("ROLE_USER") === 0)
              this.navigateToUserComponent(); 
        }, (error) => {
          this.proccessError(error);
        })
      } catch (error) {
        console.log(error);
      }
    } else{
      this.loginErrorMessage = "Invalid email address";
    }
  }

  navigateToAdminComponent(): void{
    this.router.navigateByUrl('/merchants');
  }

  navigateToUserComponent(): void{
    this.router.navigateByUrl('/user');
  }

  //Este metodo comprueba que el email ingresado sea de la forma : correo@example.com
  verifyCredentials(username: string, password: string): boolean{
    let regex = /^[A-z0-9\._\+-]{4,}@[A-z0-9\-]{3,}(\.[a-z0-9\-]{2,})+$/;
    if(regex.test(username)) 
      return true;
    return false;
  }

  proccessError(error: HttpErrorResponse){
    if(error.status === 403){
      this.loginErrorMessage = "User with that email was not found";
    }
    if(error.status === 500){
      this.loginErrorMessage = "Server execution error";
    }
  }
}


