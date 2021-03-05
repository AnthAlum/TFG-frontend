import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PostMerchantComponent } from './post-merchant/post-merchant.component';
import { PutMerchantComponent } from './put-merchant/put-merchant.component';
import { GetMerchantsComponent } from './get-merchants/get-merchants.component';
import { GetClientsComponent } from './get-clients/get-clients.component';
import { PostClientComponent } from './post-client/post-client.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'merchants-modify/:merchantId', component: PutMerchantComponent },
  { path: 'merchants-add', component: PostMerchantComponent },
  { path: 'merchants', component: GetMerchantsComponent },
  { path: 'clients', component: GetClientsComponent },
  { path: 'clients-add', component: PostClientComponent },
  //{ path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
