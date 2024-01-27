import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BirdEye } from '../../constants/task-sheet.constant';
import { CommonModule, DatePipe } from '@angular/common';
import { EditTaskPopupComponent } from '../edit-task-popup/edit-task-popup.component';

@Component({
  selector: 'app-task-sheet',
  templateUrl: './task-sheet.component.html',
  styleUrls: ['./task-sheet.component.scss'],
})
export class TaskSheetComponent {
  weekData = BirdEye.birdEyeWeek;
  taskData = BirdEye.birdEyeTask;
  newTaskData: any = [];
  newWeekData: any = [];
  footerTask = BirdEye.birdEyeFooter;
  spStartDate = '7/5/23';
  taskStyle: any = {};
  oneDayWidth: number = 20;
  taskDivHeight: string = '500px';
  currentTaskSelected: number = -1;
  hoverId: string = '';
  isShowDay: boolean = false;
  searchText: string = '';
  dateHover: string = '';

  @ViewChild('dateDiv') dateDiv!: ElementRef;
  @ViewChild('tasksDiv') tasksDiv!: ElementRef;
  @ViewChild('tasksheet', { read: ElementRef }) tasksheet!: ElementRef<any>;

  constructor(private datePipe: DatePipe, private dialog: MatDialog) {}

  calculateTaskData() {
    this.newTaskData = [];
    this.taskData.forEach((task: any) => {
      let temp = {
        ...task,
        style: this.getStyles(task.startDate, task.endDate),
      };
      this.newTaskData.push(temp);
    });
  }
  calculateWeekData() {
    this.newWeekData = [];
    this.weekData.forEach((week: any) => {
      let temp = {
        ...week,
        dates: this.getDatesBetween(week.startDate, week.endDate),
      };
      this.newWeekData.push(temp);
    });
    console.log(this.newWeekData);
  }

  ngOnInit() {
    // Example usage for 1 year before and 1 year after
    const yearlyWeeks = this.getYearlyWeekList();
    this.weekData = yearlyWeeks;
    this.spStartDate = yearlyWeeks[0].startDate;

    this.calculateTaskData();
    this.calculateWeekData();
  }
  ngAfterViewInit() {
    this.handleResize();
    // Use the ElementRef and Renderer2 to get the width of the div
    // const divWidth = this.dateDiv.nativeElement.offsetWidth;
    // this.oneDayWidth = divWidth;
    // this.handleResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Call your function here
    this.handleResize();
  }

  handleResize() {
    // Your logic to handle screen width changes
    const screenWidth = window.innerWidth;
    // Call any other functions or update properties as needed
    // const divWidth = this.dateDiv.nativeElement.offsetWidth;
    // this.oneDayWidth = divWidth;
    // this.calculateWeekData();
    // this.calculateTaskData();
    const divHeight = this.tasksDiv.nativeElement.offsetHeight;

    // const divElement: HTMLElement =
    //   this.tasksDiv.nativeElement.querySelector('#tasksDiv');
    // const divHeight2 = divElement.offsetHeight;
    this.taskDivHeight = divHeight + 100 + 'px';
  }

  convertStringToDate(date: string): Date {
    return new Date(date);
  }

  getDatesBetween(startDate: string, endDate: string): Date[] {
    const dates: Date[] = [];
    let currentDate = this.convertStringToDate(startDate);
    let newEndDate = this.convertStringToDate(endDate);
    while (currentDate <= newEndDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  isToday(date: Date) {
    const todayDate = this.datePipe.transform(date, 'dd MMM yyyy');
    const tempDate = this.datePipe.transform(new Date(), 'dd MMM yyyy');
    if (todayDate === tempDate) {
      return true;
    }
    return false;
  }

  getTaskWidth(startDate: string, endDate: string) {
    let dates = this.getDatesBetween(startDate, endDate);
    return dates.length * this.oneDayWidth + 2;
  }

  getMarginLeft(taskStartDate: string) {
    const spStartDate = this.convertStringToDate(this.spStartDate);
    const endDate = this.convertStringToDate(taskStartDate);
    const daysDifference = this.getDateDifferenceInDays(spStartDate, endDate);
    return daysDifference * this.oneDayWidth + 20;
  }

  getDateDifferenceInDays(date1: Date, date2: Date): number {
    const timeDiff = date2.getTime() - date1.getTime();
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  }

  getStyles(startDate: string, endDate: string) {
    return {
      width: this.getTaskWidth(startDate, endDate) + 'px',
      'margin-left': this.getMarginLeft(startDate) + 'px',
    };
  }

  getFooterMargin() {
    const spStartDate = this.convertStringToDate(this.spStartDate);
    const endDate = this.convertStringToDate(
      this.taskData[this.taskData.length - 1].endDate
    );
    const daysDifference = this.getDateDifferenceInDays(spStartDate, endDate);
    return daysDifference * this.oneDayWidth + 2;
  }

  getFooterStyles() {
    return {
      'margin-left': this.getFooterMargin() + 'px',
    };
  }

  // extra codes

  getWeekList() {
    const today = new Date();
    const currentWeekday = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const diff = currentWeekday === 0 ? 6 : currentWeekday - 1; // Calculate the difference to Monday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - diff); // Set to Monday of the current week

    const weeksBefore = 2;
    const weeksAfter = 4;
    const daysInWeek = 7;

    const weekList = [];

    for (let i = -weeksBefore; i <= weeksAfter; i++) {
      const startOfWeek = new Date(startDate);
      startOfWeek.setDate(startDate.getDate() + i * daysInWeek);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + daysInWeek - 1);

      weekList.push({
        start: startOfWeek,
        end: endOfWeek,
      });
    }

    return weekList;
  }

  getYearlyWeekList() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentWeekday = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const diff = currentWeekday === 0 ? 6 : currentWeekday - 1; // Calculate the difference to Monday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - diff); // Set to Monday of the current week

    const weeksBefore = 52; // 1 year before
    const weeksAfter = 52; // 1 year after
    const daysInWeek = 7;

    const yearlyWeekList = [];

    for (let i = -weeksBefore; i <= weeksAfter; i++) {
      const startOfWeek = new Date(startDate);
      startOfWeek.setDate(startDate.getDate() + i * daysInWeek);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + daysInWeek - 1);

      const weekNumber = this.getISOWeekNumber(startOfWeek);
      const year = startOfWeek.getFullYear();

      yearlyWeekList.push({
        // year: year,
        // weekNumber: weekNumber,
        weekNumber: `W-${weekNumber}`,
        name: `${this.datePipe.transform(
          startOfWeek,
          'd MMM y'
        )} - ${this.datePipe.transform(endOfWeek, 'd MMM y')}`,
        startDate: startOfWeek.toString(),
        endDate: endOfWeek.toString(),
      });
    }

    return yearlyWeekList;
  }

  // Helper function to get ISO week number
  getISOWeekNumber(date: any) {
    const newDate: any = new Date(date);
    newDate.setDate(newDate.getDate() + 4 - (newDate.getDay() || 7));
    const yearStart: any = new Date(newDate.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((newDate - yearStart) / 86400000 + 1) / 7);
    return weekNumber;
  }

  goToFirstTask() {
    this.currentTaskSelected = 0;
    this.goToTaskhandler();
  }

  goToLastTask() {
    this.currentTaskSelected = this.newTaskData.length - 1;
    this.goToTaskhandler();
  }

  goToNextTask() {
    this.currentTaskSelected += 1;
    this.goToTaskhandler();
  }

  goToPrevTask() {
    this.currentTaskSelected -= 1;
    this.goToTaskhandler();
  }

  showDays() {
    this.isShowDay = !this.isShowDay;
  }

  goToTaskhandler() {
    let margin: string =
      this.newTaskData[this.currentTaskSelected].style['margin-left'];
    const elements = this.tasksDiv.nativeElement.querySelectorAll('.abc');
    const element = elements[this.currentTaskSelected];
    const elementRect = element.getBoundingClientRect();

    const container = this.tasksheet.nativeElement;
    const containerRect = this.tasksheet.nativeElement.getBoundingClientRect();

    // Calculate the new scroll position
    const newScrollLeft =
      container.scrollLeft +
      elementRect.left +
      Number(margin.replace('px', '')) -
      50;
    const newScrollTop =
      container.scrollTop + elementRect.top - containerRect.top - 100;

    // Apply the new scroll position
    container.scrollTo({
      left: newScrollLeft,
      top: newScrollTop,
      behavior: 'smooth',
    });
  }

  openEditTaskDialog(task: any) {
    const dialogRef = this.dialog.open(EditTaskPopupComponent, {
      width: '700px',
      height: '500px',
      data: {
        isEdit: true,
        taskData: task,
      },
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data?.action === 'delete') {
        this.deleteTask(data.deleteId);
      } else if (data.id) {
        this.newTaskData.map((elem: any) => {
          if (elem.id === data.id) {
            elem.startDate = data.startDate;
            elem.endDate = data.endDate;
            elem.name = data.name;
            elem.style = this.getStyles(elem.startDate, elem.endDate);
          }
          return elem;
        });
      }
      this.handleResize();
      this.goToTaskhandler();
    });
  }

  openAddTaskDialog() {
    const dialogRef = this.dialog.open(EditTaskPopupComponent, {
      width: '700px',
      height: '500px',
      data: {
        isEdit: false,
      },
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.id) {
        let temp = {
          ...data,
          style: this.getStyles(data.startDate, data.endDate),
        };
        this.newTaskData.push(temp);
      }
      this.handleResize();
      this.currentTaskSelected = this.newTaskData.length - 1;
      setTimeout(() => {
        this.goToTaskhandler();
      }, 500);
    });
  }

  hoverHandler(value: string) {
    this.hoverId = value;
  }

  deleteTask(id: string) {
    this.newTaskData = this.newTaskData.filter((elem: any) => elem.id !== id);
  }

  searchTaskHandler() {
    this.currentTaskSelected = this.newTaskData.findIndex((elem: any) =>
      elem.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
    if (this.currentTaskSelected > -1) this.goToTaskhandler();
  }

  // setDateHover(date: string) {
  //   this.dateHover = date;
  // }
}
