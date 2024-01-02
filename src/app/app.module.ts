import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { routes, AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskSheetComponent } from './components/task-sheet/task-sheet.component';
import { EditTaskPopupComponent } from './components/edit-task-popup/edit-task-popup.component';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, TaskSheetComponent, EditTaskPopupComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule,
  ],
  providers: [provideRouter(routes), DatePipe, provideAnimations()],
  bootstrap: [AppComponent],
})
export class AppModule {}
