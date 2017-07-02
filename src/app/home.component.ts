import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MovieService } from './movie.service';
import { Movie } from './movie';
import { Observable } from 'rxjs/Observable';

enum SortType {
  score, name, platform
}
enum SortOrder {
  asc, desc
}
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css',
    '../../node_modules/bulma/css/bulma.css',
    '../../node_modules/font-awesome/css/font-awesome.css'
  ]
})
export class HomeComponent implements OnInit {


  discmovie: Movie;

  movies: Movie[];
  currPagemovies: Movie[];

  public sortBy: { sortType: SortType; order: SortOrder } =
  { sortType: SortType.score, order: SortOrder.desc };

  public itemsPerPage: number = 12;
  public currentPage: number = 0;
  public smallnumPages: number = 0;
  public totalItems: number = 0;

  public searchText: string; y
  public dataSource: Observable<any>;


  public constructor(private movieService: MovieService) {
    //    this.setDataSource();
  }
  public ngOnInit(): void {

    this.movieService.getMovieListing().subscribe(garr => {
      this.movies = garr;
      this.totalItems = this.movies.length;
      this.setCurrentPage();
    });

  }

  private setDataSource(): void {
    //    this.dataSource = Observable
    //      .create((observer: any) => {
    //        observer.next(this.discmovie);
    //      })
    //      .mergeMap((token: string) =>
    //        this.movieService.find(token));
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
    this.movies = this.movies.sort((a:any, b:any) => {
      if (this.sortBy.order == SortOrder.asc) {
        return (b.title_year) - (a.title_year);
      }
      return a.title_year - b.title_year;
    });
    this.setCurrentPage();
  }

//  public filtermoviesByText(): void {
//    const tempmovies = this.movies.slice();
//    this.movies = this.movies.filter(a => a.title.toLowerCase()
//      .search(this.searchText.toLowerCase()) > -1);
//    this.currentPage = 0;
//    this.setCurrentPage();
//    this.movies = tempmovies;
//  }

  public typeaheadOnSelect(event: any) {

  }
}
