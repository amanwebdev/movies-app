import { Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IndexedDBService } from './indexeddb.service';
import { MovieStore } from './movie-store';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css',
    '../../node_modules/bulma/css/bulma.css',
    '../../node_modules/font-awesome/css/font-awesome.css'
  ]
})

export class AppComponent {

  discMovie: string;
  dataSource: Observable<any>;

  public constructor(private movieStore: MovieStore, private indexedDB: IndexedDBService) {
    //this.setDataSource();
  }

  private setDataSource(): void {
    this.dataSource = Observable
      .create((observer: any) => {
        observer.next(this.discMovie);
      })
      .mergeMap((token: string) => this.indexedDB.getRecordByKeyword("MovieStore", "movie_title", token));

  }
}
