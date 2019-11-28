import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  STORAGE_KEY = 'local_todolist';
  anotherTodolist = [];

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  public storeOnLocalStorage(taskTitle: string): void {

    // get array of tasks from local storage
    const currentTodoList = this.storage.get(this.STORAGE_KEY) || [];
    // push new task to array
    currentTodoList.push({
      title: taskTitle,
      isChecked: false
    });
    // insert updated array to local storage
    this.storage.set(this.STORAGE_KEY, currentTodoList);
    console.log(this.storage.get(this.STORAGE_KEY) || 'LocaL storage is empty');
  }
}
