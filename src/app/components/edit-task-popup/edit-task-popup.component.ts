import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-edit-task-popup',
  templateUrl: './edit-task-popup.component.html',
  styleUrls: ['./edit-task-popup.component.scss'],
})
export class EditTaskPopupComponent {
  formData: any = {};

  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  maxEndDate: Date;

  isEdit: boolean = false;
  taskData: any = {};

  constructor(
    public dialogRef: MatDialogRef<EditTaskPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const today = new Date();
    this.minStartDate = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
    );
    this.maxStartDate = new Date(
      today.getFullYear() + 1,
      today.getMonth(),
      today.getDate()
    );

    this.minEndDate = new Date();

    this.maxEndDate = new Date(
      today.getFullYear() + 1,
      today.getMonth(),
      today.getDate()
    );

    if (data.isEdit) {
      this.isEdit = data.isEdit;
      this.taskData = data.taskData;
      this.formData.name = this.taskData.name;
      this.formData.startDate = new Date(this.taskData.startDate);
      this.formData.endDate = new Date(this.taskData.endDate);

      this.minEndDate = new Date(this.taskData.startDate);

      this.maxEndDate = new Date(
        today.getFullYear() + 1,
        today.getMonth(),
        today.getDate()
      );
    }
  }

  submitForm() {
    let result: any = {};
    if (this.isEdit) {
      result = {
        id: this.taskData.id,
        startDate: this.formData.startDate,
        endDate: this.formData.endDate,
        name: this.formData.name,
      };
    } else {
      result = {
        id: uuidv4(),
        startDate: this.formData.startDate,
        endDate: this.formData.endDate,
        name: this.formData.name,
      };
    }
    this.dialogRef.close(result);
  }
  onStartDateChange(event: any) {
    this.minEndDate = new Date(event.value);
  }
}
