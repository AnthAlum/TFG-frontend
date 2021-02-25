import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from './backend.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';


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
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private backendService: BackendService,
    private router: Router
    ) { }

    ngOnInit(): void{
      this.checkAuthenthication();
    }

    isNotLoginPage(): boolean{
      if(this.router.url !== "/login")
        return true;
      return false;
    }

    checkAuthenthication(): void{
      if(!this.backendService.authenticationDone())
        this.router.navigateByUrl("/login");
      else
        this.router.navigateByUrl("/merchants");
    }

    exit(): void{
      this.backendService.logout();
    }
}
