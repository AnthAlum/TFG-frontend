import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { AdminPageComponent } from './admin-page/admin-page.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { GetMerchantsComponent } from './get-merchants/get-merchants.component';
import {MatTableModule} from '@angular/material/table';
import { PostMerchantComponent } from './post-merchant/post-merchant.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { PutMerchantComponent } from './put-merchant/put-merchant.component';
import {MatCardModule} from '@angular/material/card';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import { PageContainerComponent } from './page-container/page-container.component';
import { MerchantCardComponent } from './merchant-card/merchant-card.component';
import { MerchantFormComponent } from './merchant-form/merchant-form.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DialogConfirmationComponent } from './dialog-confirmation/dialog-confirmation.component';
import { SnackbarMessageComponent } from './snackbar-message/snackbar-message.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { NgxSpinnerModule } from "ngx-spinner";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GetClientsComponent } from './get-clients/get-clients.component';
import { PostClientComponent } from './post-client/post-client.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AdminPageComponent,
    GetMerchantsComponent,
    PostMerchantComponent,
    PutMerchantComponent,
    PageContainerComponent,
    MerchantCardComponent,
    MerchantFormComponent,
    DeleteConfirmationComponent,
    DialogConfirmationComponent,
    SnackbarMessageComponent,
    GetClientsComponent,
    PostClientComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    MatGridListModule,
    MatInputModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    LayoutModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    NgxSpinnerModule
  ],
  exports:[AppRoutingModule],
  providers: [SnackbarMessageComponent],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
