import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSheetComponent } from './task-sheet.component';

describe('TaskSheetComponent', () => {
  let component: TaskSheetComponent;
  let fixture: ComponentFixture<TaskSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskSheetComponent]
    });
    fixture = TestBed.createComponent(TaskSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
