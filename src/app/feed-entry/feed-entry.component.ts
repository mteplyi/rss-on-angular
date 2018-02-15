import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FeedService} from '../feed.service';
import {FeedEntry} from '../models/feed-entry';

@Component({
  selector: 'app-feed-entry',
  templateUrl: './feed-entry.component.html',
  styleUrls: ['./feed-entry.component.css']
})
export class FeedEntryComponent implements OnChanges {
  feedEntry: FeedEntry;
  @Input() private feedUrl: string;
  @Input() private feedEntryGuid: string;

  constructor(private feedService: FeedService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('feedUrl') || changes.hasOwnProperty('feedEntryGuid')) {
      this.feedService.getFeedEntry(this.feedUrl, this.feedEntryGuid)
        .subscribe(feedEntry => this.feedEntry = feedEntry);
    }
  }
}
