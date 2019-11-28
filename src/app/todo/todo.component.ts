import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { AppService } from '../app.service';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  constructor(private fb: FormBuilder, private http: HttpClient, private localService: AppService, @Inject(LOCAL_STORAGE) private storage: StorageService) { }

  todo = this.fb.group({
    id: [],
    title: [],
    desc: []
  });

  cards: any = [];


  ngOnInit() {
    this.fetchData(true);
    const newTodo = 'new todo';
    //this.localService.storeOnLocalStorage(newTodo);
  }

  onSubmit(todo) {
    let param = {
      title: todo.title,
      desc: todo.desc
    }
    if (todo.id !== null) {
      this.http.put(`http://localhost:3000/todo/${todo.id}`, param).subscribe(res => {
        this.fetchData(false);
      });
    } else {
      this.http.post('http://localhost:3000/todo', todo).subscribe(res => {
        this.fetchData(false);
      });
    }
    this.todo.reset();
  }

  fetchData(forceFeach) {
    let local = this.storage.get('local_todolist');
    if (!!local&&forceFeach) {
      this.cards = JSON.parse(local);
    }
    else {
      this.http.get('http://localhost:3000/todo').subscribe(res => {
        this.cards = res;
        var locall = JSON.stringify(this.cards);
        this.storage.set('local_todolist', locall);
      })
    }
  }

  deleteTodo(id) {
    this.http.delete(`http://localhost:3000/todo/${id}`).subscribe(res =>
      this.fetchData(false)
    )
  }

  getTodo(id) {
    this.cards.forEach(element => {
      if (element.id === id) {
        this.todo.patchValue({
          id: element.id,
          title: element.title,
          desc: element.desc
        })
      }
    });
  }
}
