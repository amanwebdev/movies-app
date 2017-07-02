import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injectable, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home.component';
import { AnalyticsComponent } from './analytics.component';
import { MovieService } from './movie.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { IndexedDBService } from './indexeddb.service';
import { Movie } from './movie';
import { MovieStore } from './movie-store';

@Injectable() export class IndexedDB {

  constructor(public indexedDB: IndexedDBService, public entity: MovieStore) { }

  load(): Promise<void> {

    var promise: Promise<any> = new Promise((resolve: any) => {

      this.indexedDB.openDBAsync("movie-app-db", 1).forEach(

        (readyState: string) => {

          console.log('IndexedDB service: opening db: ' + readyState);

        }, null

      ).then(

        () => {

          this.indexedDB.getAllRecordsAsync("MovieStore").forEach(

            (record: Movie) => {

              if (record != null) {
                record.genres.split("|").forEach(g => {
                  this.entity.addGenre(g);
                });

                this.entity.addMovie(record);
              }
            }, null

          ).then(() => {

            resolve(true);
            this.entity.isGenresListAvailableSubject.next(true);
            console.log('IndexedDB service: obtaining of all records completed.' + "genres" + this.entity.availableGenres);

          });

        });

    });

    return promise;

  }

}

export function initIndexedDB(indexedDB: IndexedDB): Function {
  return () => indexedDB.load();
}

@NgModule({
  declarations: [
    AppComponent, HomeComponent, AnalyticsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    PaginationModule.forRoot(),
    TypeaheadModule.forRoot(),
    AppRoutingModule
  ],
  providers: [MovieService, IndexedDBService, MovieStore, IndexedDB,
    {
      provide: APP_INITIALIZER,
      useFactory: initIndexedDB,
      deps: [IndexedDB],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
