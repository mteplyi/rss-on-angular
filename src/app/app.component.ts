import {Component} from '@angular/core';

import {FeedService} from './feed.service';
import {Feed} from './models/feed';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  feeds: Feed[];

  constructor(private feedService: FeedService) {
    this.feedService.getFeeds()
      .subscribe(feeds => this.feeds = feeds);
  }

  updateAllFeeds() {
    this.feedService.updateAllFeeds();
  }

  addFeed() {
    const feedUrl = prompt('Add Feed url:');
    if (!feedUrl) {
      return;
    }
    this.feedService.addFeed(feedUrl).catch(alert);
  }

  removeFeed(feedUrl) {
    this.feedService.removeFeed(feedUrl);
  }
}
