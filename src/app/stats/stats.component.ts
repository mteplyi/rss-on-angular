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
          let authorCount = 0;
          const authorRegister = {};
          feedEntries.forEach(({author}) => {
            if (!authorRegister.hasOwnProperty(author)) {
              authorRegister[author] = true;
              authorCount++;
            }
          });
          this.selectedFeedAuthorsCount = authorCount;
        });
    }
    if (changes.hasOwnProperty('feedUrl') || changes.hasOwnProperty('feedEntryGuid')) {
      this.feedService.getFeedEntry(this.feedUrl, this.feedEntryGuid)
        .subscribe(feedEntry => {
          if (!feedEntry || !feedEntry.hasOwnProperty('content')) {
            return;
          }
          const letterRegister = {};
          feedEntry.content
            .replace(/<[^><]*>|[^a-z]+|\s+/gui, '')
            .toLocaleUpperCase()
            .split('')
            .sort()
            .forEach(letter => {
              if (!letterRegister.hasOwnProperty(letter)) {
                letterRegister[letter] = 1;
              } else {
                letterRegister[letter]++;
              }
            });
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
