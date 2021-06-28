import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Task } from '../classes/task';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.databaseUrl}tasks.json`).pipe(
      map((tasks) => {
        let tasksArray: Task[] = [];
        for (const key in tasks) {
          if (Object.prototype.hasOwnProperty.call(tasks, key)) {
            const task = tasks[key];
            tasksArray.push(task);
          }
        }
        return tasksArray;
      })
    );
  }
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${environment.databaseUrl}tasks.json`, task);
  }
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(
      `${environment.databaseUrl}tasks/${task.id}.json`,
      task
    );
  }
  deleteTask(task: Task): Observable<Task> {
    return this.http.delete<Task>(
      `${environment.databaseUrl}tasks/${task.id}.json`
    );
  }
}
