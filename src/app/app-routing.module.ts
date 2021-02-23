import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PostMerchantComponent } from './post-merchant/post-merchant.component';
import { PutMerchantComponent } from './put-merchant/put-merchant.component';
import { GetMerchantsComponent } from './get-merchants/get-merchants.component';
import { MerchantFormComponent } from './merchant-form/merchant-form.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'merchants/modify/:id', component: PutMerchantComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: 'merchants', component: GetMerchantsComponent },
  { path: 'merchants/add', component: PostMerchantComponent },
  //{ path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
