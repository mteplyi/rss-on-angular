import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFeedEntryGuid: string;
  private selectedFeedUrlValue: string;

  get selectedFeedUrl() {
    return this.selectedFeedUrlValue;
  }

  set selectedFeedUrl(value) {
    this.selectedFeedUrlValue = value;
    this.selectedFeedEntryGuid = null;
  }
}
