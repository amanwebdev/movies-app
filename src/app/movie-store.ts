import { Injectable } from '@angular/core';
import { Movie } from './movie';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable() export class MovieStore {


  movies: Array<Movie> = [];

  genres = new Set();
  isGenresListAvailableSubject = new BehaviorSubject<boolean>(false);

  addMovie(record: Movie) {

    this.movies.push(record);

  }

  addGenre(genre: string) {
    this.genres.add(genre);
  }

  deleteTodo(record: Movie) {

    var index: number = this.movies.indexOf(record);
    this.movies.splice(index, 1);

  }

  get availableGenres() {
    console.log(this.genres.size);
    return Array.from(this.genres);
  }

  get isGenresListAvailable() {
    return this.isGenresListAvailableSubject.asObservable();
  }
  
  clearTodos() {

    this.movies.splice(0);

  }


  createKey(): string {

    //return uuid.v4();
    return "";
  }

}
