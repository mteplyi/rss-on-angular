import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FeedService} from '../feed.service';
import {FeedEntryIdentifier} from '../models/feed-entry-identifier';
import {FeedEntry} from '../models/feed-entry';

@Component({
  selector: 'app-feed-entry',
  templateUrl: './feed-entry.component.html',
  styleUrls: ['./feed-entry.component.css']
})
export class FeedEntryComponent implements OnChanges {
  feedEntry: FeedEntry;
  @Input() private feedEntryIdentifier: FeedEntryIdentifier;

  constructor(private feedService: FeedService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.hasOwnProperty('feedEntryIdentifier')) {
      this.feedService.getFeedEntry(this.feedEntryIdentifier)
        .subscribe(feedEntry => this.feedEntry = feedEntry);
    }
  }
}
