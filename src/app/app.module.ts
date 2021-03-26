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
import { PutClientComponent } from './put-client/put-client.component';
import { ClientCardComponent } from './client-card/client-card.component';
import { GetMeetingsComponent } from './get-meetings/get-meetings.component';
import { MeetingDetailComponent } from './meeting-detail/meeting-detail.component';
import { PutMeetingComponent } from './put-meeting/put-meeting.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateAdapter, NgxMatTimepickerModule, NgxNativeDateModule } from '@angular-material-components/datetime-picker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import { MeetingCreateComponent } from './meeting-create/meeting-create.component';

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
    PostClientComponent,
    PutClientComponent,
    ClientCardComponent,
    GetMeetingsComponent,
    MeetingDetailComponent,
    PutMeetingComponent,
    MeetingCreateComponent,
  ],
  imports: [
    MatChipsModule,
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
    NgxSpinnerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxNativeDateModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  exports:[
    AppRoutingModule,
  ],
  providers: [
    SnackbarMessageComponent,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents:[
    MeetingDetailComponent,
  ],
})
export class AppModule { }
