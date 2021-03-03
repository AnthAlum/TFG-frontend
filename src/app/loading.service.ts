import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  hideElement: boolean = false;

  constructor(
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) {
  }
  
  ngOnInit(): void {
  }
  
  show(): void{
    this.spinnerService.show();
  }

  hide(): void{
    this.spinnerService.hide();
  }

}