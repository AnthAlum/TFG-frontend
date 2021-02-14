import { Component, OnInit } from '@angular/core';
import { MatGridList } from '@angular/material/grid-list';
import { FormControl, Validators } from '@angular/forms';
import { BackendService, JsonCredentials } from '../backend.service';
import { Observable } from 'rxjs';

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

  jwtAuthentication: string = "";

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

  constructor(private backendService : BackendService) { }

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
      console.log(this.jwtAuthentication);
    });
  }

}
