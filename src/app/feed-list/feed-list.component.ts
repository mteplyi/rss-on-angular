import {Component, EventEmitter, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Feed} from '../models/feed';
import {FeedService} from '../feed.service';

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.css']
})
export class FeedListComponent {
  feeds: Feed[];
  @Output() private select = new EventEmitter<string>();

  constructor(private feedService: FeedService) {
    feedService.getFeeds()
      .subscribe(feeds => this.feeds = feeds);
  }

  onAdd(): void {
    const feedUrl = prompt('Feed url:');
    if (!feedUrl) {
      return;
    }
    this.feedService.addFeed(feedUrl).catch(alert);
  }

  onUpdateAll(): void {
    this.feedService.updateAllFeeds();
  }

  onRemove(feed: Feed): void {
    this.feedService.removeFeed(feed.url);
  }

  onSelect(feed: Feed): void {
    this.select.emit(feed.url);
  }
}
