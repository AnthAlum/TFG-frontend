import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BackendService } from './backend.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BackendClientsService } from './backend-clients.service';
import { BackendMeetingsService } from './backend-meetings.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsersessionService } from './usersession.service';

const JWT_PREFIX = "Bearer ";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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

  jwtHelperService = new JwtHelperService();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private spinnerService: LoadingService,
    private usersessionService: UsersessionService,
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
      if(!this.usersessionService.authenticationDone())
        this.router.navigateByUrl("/login");
    }

    goToModifyMerchant(id: number): void{
      this.router.navigateByUrl(`/merchants-modify/${this.usersessionService.id}`);
    }

    exit(): void{
      this.usersessionService.logout();
      this.router.navigateByUrl("/login");
    }
}
