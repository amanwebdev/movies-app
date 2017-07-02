
import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { MovieService } from './movie.service';

import { Movie } from './movie';

@Injectable() export class IndexedDBService {

  db: IDBDatabase;

  constructor(private movieService: MovieService) { }

  openDBAsync(dbName: string, version: number) {

    return new Observable((observer: Observer<string>) => {

      var request: IDBOpenDBRequest = indexedDB.open(dbName, version);

      request.onsuccess = (event: Event) => {

        this.db = (<IDBOpenDBRequest>event.target).result;

        observer.next((<IDBOpenDBRequest>event.target).readyState);
        observer.complete();

      };
      request.onerror = (event: Event) => {

        console.log('IndexedDB service: ' + (<IDBOpenDBRequest>event.target).error.name);

        observer.error((<IDBOpenDBRequest>event.target).error.name);


      };
      request.onupgradeneeded = (event: Event) => {

        this.db = (<IDBOpenDBRequest>event.target).result;;

        var movieStore: IDBObjectStore = this.db.createObjectStore("MovieStore", { keyPath: 'id', autoIncrement: true });

        console.log('IndexedDB service: creating ' + dbName + ' completed.');
        
        this.fetchDataFromApi();
      }

    });

  }
  
  private fetchDataFromApi(){
    this.movieService.getMovieListing().subscribe(garr => {
      const movies = garr;
      

      movies.forEach(m => {
        this.addRecordAsync("MovieStore", m).forEach(
          (readyState) => { console.log('IndexedDB service: adding record: ' + readyState); }, null
        );
      });

    });
  }

  private getObjectStore(storeName: string, mode: string) {

    var tx: IDBTransaction = this.db.transaction(storeName, mode);
    return tx.objectStore(storeName);

  }

  getAllRecordsAsync(storeName: string) {

    var store: IDBObjectStore = this.getObjectStore(storeName, "readonly");

    return new Observable((observer: Observer<any>) => {

      var request: IDBRequest = store.openCursor();

      request.onsuccess = (event: Event) => {

        var cursor: IDBCursorWithValue = (<IDBRequest>event.target).result;

        if (cursor) {

          observer.next(cursor.value);
          cursor.continue();

        }
        else {

          observer.complete();

        }

      }
      request.onerror = (event: Event) => {

        console.log('IndexedDB service: ' + (<IDBRequest>event.target).error.name);

        observer.error((<IDBRequest>event.target).error.name);

      }

    });

  }


  getRecordByKeyword(storeName: string, indexName: string, keyword: any): Observable<Movie[]> {

    var store: IDBObjectStore = this.getObjectStore(storeName, "readonly");

    return new Observable((observer: Observer<any>) => {

      var request: IDBRequest = store.openCursor();
      const movies = [];
      request.onsuccess = (event: Event) => {

        var cursor: IDBCursorWithValue = (<IDBRequest>event.target).result;

        if (cursor) {


          cursor.continue();
          var str = JSON.stringify(cursor.value);
          var movie: Movie = JSON.parse(str);
          if (movie.movie_title.toLowerCase()
            .search(keyword.toLowerCase()) > -1) {

            var existing: Movie[] = movies.filter(m => {
              return m.movie_title === movie.movie_title;
            })
            if (existing && existing.length == 0) {
              movies.push(movie);
            }

          }

        }
        else {
          console.log("returngin mmovies " + movies.length);
          observer.next(movies);
        }

      }
      request.onerror = (event: Event) => {

        console.log('IndexedDB service: ' + (<IDBRequest>event.target).error.name);

        observer.error((<IDBRequest>event.target).error.name);

      }

    });
  }

  addRecordAsync(storeName: string, record: any) {

    var store: IDBObjectStore = this.getObjectStore(storeName, "readwrite");

    return new Observable((observer: Observer<string>) => {

      var request: IDBRequest = store.add(record); // Adds a new record.

      // Success.
      request.onsuccess = (event: Event) => {

        observer.next((<IDBRequest>event.target).readyState);
        observer.complete();

      }
      // Error.
      request.onerror = (event: Event) => {

        console.log('IndexedDB service: ' + (<IDBRequest>event.target).error.name);

        observer.error((<IDBRequest>event.target).error.name);

      }

    });

  }
  deleteRecordAsync(storeName: string, key: string) {

    var store: IDBObjectStore = this.getObjectStore(storeName, "readwrite");

    return new Observable((observer: Observer<string>) => {

      var request: IDBRequest = store.delete(key);

      request.onsuccess = (event: Event) => {

        observer.next((<IDBRequest>event.target).readyState);
        observer.complete();

      }
      request.onerror = (event: Event) => {

        console.log('IndexedDB service: ' + (<IDBRequest>event.target).error.name);

        observer.error((<IDBRequest>event.target).error.name);

      }

    });

  }

  editRecordAsync(storeName: string, record: any) {

    var store: IDBObjectStore = this.getObjectStore(storeName, "readwrite");

    return new Observable((observer: Observer<string>) => {

      var request: IDBRequest = store.put(record);

      request.onsuccess = (event: Event) => {

        observer.next((<IDBRequest>event.target).readyState);
        observer.complete();

      }
      request.onerror = (event: Event) => {

        console.log('IndexedDB service: ' + (<IDBRequest>event.target).error.name);

        observer.error((<IDBRequest>event.target).error.name);

      }

    });

  }

  clearObjectStoreAsync(storeName: string) {

    var store: IDBObjectStore = this.getObjectStore(storeName, "readwrite");

    return new Observable((observer: Observer<string>) => {

      var request: IDBRequest = store.clear();

      request.onsuccess = (event: Event) => {

        observer.next((<IDBRequest>event.target).readyState);
        observer.complete();

      }
      request.onerror = (event: Event) => {

        console.log('IndexedDB service: ' + (<IDBRequest>event.target).error.name);

        observer.error((<IDBRequest>event.target).error.name);

      }

    });

  }

  closeDB() {

    this.db.close();

  }

}
