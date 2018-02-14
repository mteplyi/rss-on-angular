import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {FeedService} from './feed.service';
import {FeedListComponent} from './feed-list/feed-list.component';
import {FeedEntryListComponent} from './feed-entry-list/feed-entry-list.component';
import {FeedEntryComponent} from './feed-entry/feed-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedListComponent,
    FeedEntryListComponent,
    FeedEntryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [FeedService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
