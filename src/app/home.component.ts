import { Component, OnInit } from '@angular/core';
import { MovieService } from './movie.service';
import { Movie } from './movie';
import { MovieStore } from './movie-store';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AngularIndexedDB } from 'angular2-indexeddb';
import { IndexedDBService } from './indexeddb.service';

enum SortType {
  score, name, platform
}
enum SortOrder {
  asc, desc
}
@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {




  movies: Movie[];
  currPagemovies: Movie[];

  public sortBy: { sortType: SortType; order: SortOrder } =
  { sortType: SortType.score, order: SortOrder.desc };

  public itemsPerPage: number = 12;
  public currentPage: number = 0;
  public smallnumPages: number = 0;
  public totalItems: number = 0;

  public searchText: string; y


  private db: AngularIndexedDB;

  public genreFilters: string[] = [];

  public constructor(private movieService: MovieService, 
    private indexedDB: IndexedDBService, private movieStore: MovieStore) {
    
  }
  public ngOnInit(): void {

    this.movieService.getMovieListing().subscribe(garr => {
      this.movies = garr;
      this.totalItems = this.movies.length;
      this.setCurrentPage();

      this.movies.forEach(m => {
        this.indexedDB.addRecordAsync("MovieStore", m).forEach(
          (readyState) => { console.log('IndexedDB service: adding record: ' + readyState); }, null
        );
      });

    });

  }

  get moviesList(): Observable<Array<Movie>> {

    return new Observable((observer: Observer<Array<Movie>>) => {

      observer.next(this.movieStore.movies);
      observer.complete();

    });

  }




  public pageChanged(event: any): void {
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
    this.currentPage = event.page - 1;
    this.setCurrentPage();
  }

  public setCurrentPage(): void {
    this.currPagemovies = this.movies.slice(this.currentPage * this.itemsPerPage,
      (this.currentPage * this.itemsPerPage) + this.itemsPerPage);
  }

  public sortByBudget(): void {
    this.currentPage = 0;
    this.sortBy.sortType = SortType.score;
    this.sortBy.order = this.sortBy.order === SortOrder.asc ? SortOrder.desc : SortOrder.asc;


    this.movies = this.movies.sort((a: any, b: any) => {
      if (this.sortBy.order == SortOrder.desc) {
        return (b.budget) - (a.budget);
      }
      return a.budget - b.budget;
    });
    this.setCurrentPage();
  }
  public sortByYear(): void {
    this.currentPage = 0;
    this.sortBy.sortType = SortType.name;
    this.sortBy.order = this.sortBy.order === SortOrder.asc ? SortOrder.desc : SortOrder.asc;
    this.movies = this.movies.sort((a: any, b: any) => {
      if (this.sortBy.order == SortOrder.asc) {
        return (b.title_year) - (a.title_year);
      }
      return a.title_year - b.title_year;
    });
    this.setCurrentPage();
  }

  public addGenreInFiltres(genre: string, checked: true) {
    if (checked == true) {
      if (this.genreFilters.filter(e => e === genre).length === 0) {
        this.genreFilters.push(genre);
      }
    } else {
      this.genreFilters = this.genreFilters.filter(e => e != genre);
    }

    this.filterMoviesList();
    this.resetPagination();
  }

  public resetFilters() {
    this.genreFilters = [];
    this.filterMoviesList();
    this.resetPagination();
  }

  public isGenreChecked(genre: any): boolean {
    return this.genreFilters.indexOf(genre) > -1;
  }

  public filterMoviesList(): void {
    if (this.genreFilters.length == 0) {
      this.movies = this.movieStore.movies;
      return;
    }
    this.movies = this.movieStore.movies.filter(m => {
      const res = m.genres.split("|").filter(g => {
        return this.genreFilters.indexOf(g) > -1
      })
      return (res.length > 0);
    });
  }
  public resetPagination() {
    this.currentPage = 0;
    this.setCurrentPage();
  }

  public typeaheadOnSelect(event: any) {

  }
}
