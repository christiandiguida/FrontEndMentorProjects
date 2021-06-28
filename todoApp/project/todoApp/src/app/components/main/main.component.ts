import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Task } from 'src/app/classes/task';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterViewChecked {
  activeTasks: Task[] = [];
  completedTasks: Task[] = [];
  tasks: Task[] = [];
  newTask: Task = new Task();
  checked: boolean = false;
  taskList: string = 'all';
  constructor(private restService: RestService) {}

  createTask() {
    if (
      this.newTask.description !== undefined &&
      this.newTask.description.length < 120
    ) {
      this.tasks.push(this.newTask);
      this.newTask.position = this.tasks.length;
      this.newTask.state = 'active';
      this.restService.createTask(this.newTask).subscribe((task: any) => {
        this.newTask.id = task.name;
        this.ngOnInit();
        this.restService.updateTask(this.newTask).subscribe(() => {
          this.ngOnInit();
        });
        this.newTask = new Task();
      });
    }
  }
  mouseOver(position: number) {
    let task: HTMLElement = <HTMLElement>(
      document.querySelectorAll('.task')[position].lastChild
    );
    if (task.style.color !== 'black') {
      task.style.color = 'black';
      task.style.transform = 'translateX(-20px)';
    } else {
      task.style.color = 'transparent';
      task.style.transform = 'translateX(0px)';
    }
  }
  deleteTask(task: Task) {
    this.restService.deleteTask(task).subscribe(() => this.ngOnInit());
  }
  check(task: Task) {
    this.checked = !this.checked;
    let checkContainer: HTMLElement = <HTMLElement>(
      document.querySelectorAll('.taskCheckbox')[task.position]
    );
    if (checkContainer.style.background === 'none') {
      checkContainer.style.background =
        'linear-gradient(hsl(192, 100%, 67%), hsl(280, 87%, 65%)';
      checkContainer.firstChild.textContent = 'done';
      task.state = 'completed';
      this.restService.updateTask(task).subscribe(() => this.showActive());
    } else {
      checkContainer.style.background = 'none';
      task.state = 'active';
      this.restService.updateTask(task).subscribe();
    }
    this.ngOnInit();
  }
  showActive() {
    this.taskList = 'active';
    console.log(this.activeTasks);
    this.tasks = this.activeTasks;
    this.activeState(1);
    this.ngOnInit();
  }
  activeState(position: number) {
    document.querySelectorAll('.controller span').forEach((s: HTMLElement) => {
      if ((s.style.color = 'red')) {
        s.style.color = 'black';
      }
    });
    let span: HTMLElement = <HTMLElement>(
      document.querySelectorAll('.controller span')[position]
    );
    span.style.color = 'red';
  }
  showCompleted() {
    this.taskList = 'completed';
    console.log(this.completedTasks);
    this.tasks = this.completedTasks;
    this.activeState(2);
    this.ngOnInit();
  }
  showAll() {
    this.ngOnInit();
    this.activeState(0);
  }
  ngOnInit(): void {
    this.restService.getTasks().subscribe((tasks) => {
      this.activeTasks = [];
      this.completedTasks = [];
      this.tasks = [];
      tasks.forEach((t) => {
        t.state === 'active'
          ? this.activeTasks.push(t)
          : this.completedTasks.push(t);
      });
      switch (this.taskList) {
        case 'active':
          this.tasks = this.activeTasks;
          break;
        case 'all':
          this.tasks = tasks;
          break;
        case 'completed':
          this.tasks = this.completedTasks;
          break;
        default:
          break;
      }
    });
  }

  ngAfterViewChecked(): void {
    this.checkCompleted();
  }

  checkCompleted(): void {
    this.tasks.forEach((t) => {
      let checkContainer: HTMLElement = <HTMLElement>(
        document.querySelectorAll('.taskCheckbox')[t.position]
      );
      if (t.state === 'completed') {
        checkContainer.style.background =
          'linear-gradient(hsl(192, 100%, 67%), hsl(280, 87%, 65%)';
        checkContainer.firstChild.textContent = 'done';
      } else {
        checkContainer.style.background = 'none';
      }
    });
  }
}
