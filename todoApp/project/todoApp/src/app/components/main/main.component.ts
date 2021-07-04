import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Task } from 'src/app/classes/task';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterViewChecked {
  tasks: Task[] = [];
  newTask: Task = new Task();
  checked: boolean = false;
  taskList: string = 'all';
  globalPosition: number = 0;
  globalTheme: string = 'light';
  constructor(private restService: RestService) {}

  toggleTheme() {
    let toggler: HTMLElement = document.getElementById('themeToggle');
    toggler.innerHTML =
      toggler.innerHTML === 'brightness_5'
        ? 'nightlight_round'
        : 'brightness_5';
    this.changeTheme();
  }
  changeTheme() {
    let body = document.getElementsByTagName('body')[0];
    body.style.background = 'hsl(235, 21%, 11%)';
  }

  createTask() {
    if (this.newTask.description !== undefined) {
      this.tasks.push(this.newTask);
      this.newTask.state = 'active';
      this.restService.createTask(this.newTask).subscribe((task: any) => {
        this.newTask.id = task.name;
        this.restService.updateTask(this.newTask).subscribe(() => {
          this.ngOnInit();
        });
        this.newTask = new Task();
      });
    }
  }
  mouseOver(task: Task) {
    let deleteButton: HTMLElement = <HTMLElement>(
      document.querySelectorAll('.task')[this.tasks.indexOf(task)].lastChild
    );
    if (deleteButton.style.color !== 'black') {
      deleteButton.style.color = 'black';
      deleteButton.style.transform = 'translateX(-20px)';
    } else {
      deleteButton.style.color = 'transparent';
      deleteButton.style.transform = 'translateX(0px)';
    }
  }
  deleteTask(task: Task) {
    this.restService.deleteTask(task).subscribe(() => this.ngOnInit());
  }
  deleteCompleted() {
    this.tasks.forEach((t) => {
      if (t.state === 'completed') {
        this.restService.deleteTask(t).subscribe(() => this.ngOnInit());
      }
    });
  }
  check(task: Task) {
    let checkContainer: HTMLElement = <HTMLElement>(
      document.querySelectorAll('.doneCheckbox:checked')[
        this.tasks.indexOf(task)
      ]
    );
    let taskDescription: HTMLElement = <HTMLElement>(
      document.querySelectorAll('.task p')[this.tasks.indexOf(task)]
    );
    if (checkContainer) {
      task.state = 'completed';
      this.restService.updateTask(task).subscribe(() => {
        taskDescription.classList.add('completed');
      });
    } else {
      task.state = 'active';
      this.restService.updateTask(task).subscribe(() => {
        taskDescription.classList.remove('completed');
      });
    }
  }

  ngOnInit(): void {
    this.restService.getTasks().subscribe((tasks) => {
      this.showTasks(this.globalPosition);
    });
  }

  ngAfterViewChecked(): void {
    this.checkCompleted();
  }

  checkCompleted(): void {
    this.tasks.forEach((t) => {
      let checkContainer: HTMLElement = <HTMLElement>(
        document.querySelectorAll('.doneCheckbox')[this.tasks.indexOf(t)]
      );
      let taskDescription: HTMLElement = <HTMLElement>(
        document.querySelectorAll('.task p')[this.tasks.indexOf(t)]
      );
      if (t.state === 'completed') {
        checkContainer.setAttribute('checked', 'true');
        taskDescription.classList.add('completed');
      }
    });
  }
  showTasks(position: number) {
    this.globalPosition = position;
    let radioListInput: HTMLElement = <HTMLElement>(
      document.querySelectorAll('.radioListInput')[position]
    );
    radioListInput.setAttribute('checked', 'true');
    this.restService.getTasks().subscribe((tasks) => {
      switch (position) {
        case 0:
          this.tasks = tasks;
          break;
        case 1:
          this.tasks = tasks.filter((f) => f.state === 'active');
          break;
        case 2:
          this.tasks = tasks.filter((f) => f.state === 'completed');
          break;
        default:
          break;
      }
    });
  }
}
