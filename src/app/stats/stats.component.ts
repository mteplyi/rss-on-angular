import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FeedService} from '../feed.service';
import {Feed} from '../models/feed';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnChanges {
  feedsCount: number;
  selectedFeedEntriesCount: number;
  selectedFeedAuthorsCount: number;
  chartLabels: string[];
  chartData: number[];
  @Input() feedUrl: string;
  @Input() feedEntryGuid: string;

  constructor(private feedService: FeedService) {
    feedService.getFeeds()
      .map((feeds: Feed[]) => feeds.length)
      .subscribe(feedsCount => this.feedsCount = feedsCount);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('feedUrl')) {
      this.feedService.getFeedEntries(this.feedUrl)
        .subscribe(feedEntries => {
          this.selectedFeedEntriesCount = feedEntries.length;
          let authorCounter = 0;
          const authorRegister = {};
          for (const {author} of feedEntries) {
            if (!authorRegister.hasOwnProperty(author)) {
              authorCounter++;
              authorRegister[author] = true;
            }
          }
          this.selectedFeedAuthorsCount = authorCounter;
        });
    }
    if (changes.hasOwnProperty('feedUrl') || changes.hasOwnProperty('feedEntryGuid')) {
      this.feedService.getFeedEntry(this.feedUrl, this.feedEntryGuid)
        .subscribe(feedEntry => {
          if (!feedEntry || !feedEntry.hasOwnProperty('content')) {
            return;
          }
          const letterRegister = {A: 1, B: 2, C: 3};

          // const arr = feedEntry.content
          //   .match(/[^<]([a-z])[^>]/gui);
          // console.log(arr);

          const chartLabels = [];
          const chartData = [];
          Object.keys(letterRegister).forEach((letter: string) => {
            chartLabels.push(letter);
            chartData.push(letterRegister[letter]);
          });
          this.chartLabels = chartLabels;
          this.chartData = chartData;
        });
    }
  }
}
