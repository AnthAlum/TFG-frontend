<<<<<<< HEAD
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BackendService } from './backend.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BackendClientsService } from './backend-clients.service';

=======
import { Component } from '@angular/core';
>>>>>>> 809c776ed983e7a86db28334e52c398f70860018

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
<<<<<<< HEAD
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'PYMES application';
  merchants: any = undefined;
  postOption: boolean = false;
  putOption: boolean = false;
  hideElement: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private backendService: BackendService,
    private router: Router,
    private spinnerService: LoadingService,
    private clientsService: BackendClientsService,
    ) { }

    ngOnInit(): void{
      this.checkAuthenthication();
      this.showLoading();
    }

    showLoading(): void{
      if(this.router.url !== "/merchants")
        this.spinnerService.show();
    }

    isNotLoginPage(): boolean{
      if(this.router.url !== "/login")
        return true;
      return false;
    }

    checkAuthenthication(): void{
      if(!this.backendService.authenticationDone())
        this.router.navigateByUrl("/login");
    }

    exit(): void{
      this.backendService.logout();
      this.clientsService.logout();
    }
=======
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
>>>>>>> 809c776ed983e7a86db28334e52c398f70860018
}
