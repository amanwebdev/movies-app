import { Component, OnInit } from '@angular/core';
import { MovieStore } from './movie-store';



interface ChartOptions {
  xAxis?: any;
  tooltip?: any;
  title?: any;
  subtitle?: any;
  series?: any[];
  yAxis?: any;
  legend?: any;
  plotOptions?: any;
  chart?: any;
}

interface MovieByYear {
  year: number;
  count: number;
}

@Component({
  selector: 'analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  movies: MovieByYear[] = [];
  seriesOptions: any[] = [];
  options: ChartOptions;

  data: any;
  dataStr: string;

  public constructor(private movieStore: MovieStore) {

  }

  public ngOnInit(): void {

    var map = this.movieStore.movies.reduce(function(prev, cur) {
      prev[cur.title_year] = (prev[cur.title_year] || 0) + 1;
      return prev;
    }, {});

    this.data = Object.keys(map).map(v => {
      return [Number(v), map[v]];
    }).filter(i => {
      return i[0]!==0;
     });
    this.dataStr = JSON.stringify(this.data);

    this.options = this.getNewOptions();
  }

  getNewOptions(): ChartOptions {
    return {
      title:{
        text:'Releases in a Year'
      },
      xAxis: {
        minPadding: 0.05,
        maxPadding: 0.05,
        title: {
          text: 'Year'
        }
      }, yAxis: {
        title: {
          text: 'Number of Movies'
        }
      },
      tooltip: {
        enabled: false
      },
      chart: {
        width: 1200,
        height: 600
      },
      legend : {
        enabled : false
      },
      series: [{
        data: this.data

      }]
    };

  }
}
