import { Component, OnInit } from '@angular/core';
import { MatGridList } from '@angular/material/grid-list';
import { FormControl, Validators } from '@angular/forms';
import { BackendService, JsonCredentials } from '../backend.service';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

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

  jwtAuthentication: string = "";
  authority: string = "";

  helper = new JwtHelperService();

  tiles: Tile[] = [
    {cols: 1, rows: 2, color: 'lightblue'},
    {cols: 1, rows: 2, color: 'lightgreen'},
  ];

  emailFormControl = new FormControl('email', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('password', [
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
    this.backendService.postCredentials(credentials)
    .subscribe(jwtAuthentication => {
      this.jwtAuthentication = jwtAuthentication.JWT;
      const jwt = this.jwtAuthentication.replace(JWT_PREFIX, "");
      const tokenInfo = this.helper.decodeToken(jwt);
      this.authority = tokenInfo.authorities[0].authority;
      this.backendService.postJwt(this.jwtAuthentication);
      if(this.authority.localeCompare("ROLE_ADMIN") === 0)
        this.navigateToAdminComponent();
      if(this.authority.localeCompare("ROLE_USER") === 0)
        this.navigateToUserComponent();
    });
  }

  navigateToAdminComponent(): void{
    this.router.navigateByUrl('/admin');
  }

  navigateToUserComponent(): void{
    this.router.navigateByUrl('/user');
  }
}


