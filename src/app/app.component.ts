import {Component} from '@angular/core';

import {FeedsService} from './feeds.service';
import {Feed} from './models/feed';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  feeds: Feed[];

  constructor(private feedsService: FeedsService) {
    this.feedsService.feeds
      .subscribe(feeds => this.feeds = feeds);
  }

  updateAllFeeds() {
    this.feedsService.updateAllFeeds();
  }

  addFeed() {
    const feedUrl = prompt('Add Feed url:');
    if (!feedUrl) {
      return;
    }
    this.feedsService.addFeed(feedUrl).catch(alert);
  }

  removeFeed(feedUrl) {
    this.feedsService.removeFeed(feedUrl);
  }
}
