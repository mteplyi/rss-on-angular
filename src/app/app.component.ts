import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFeedUrl: string;
  selectedFeedEntryGuid: string;

  onSelectFeed(feedUrl: string): void {
    this.selectedFeedUrl = feedUrl;
  }

  onSelectFeedEntry(feedEntryGuid: string): void {
    this.selectedFeedEntryGuid = feedEntryGuid;
  }
}
