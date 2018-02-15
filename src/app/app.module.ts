import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ChartsModule} from 'ng4-charts/ng4-charts';

import {AppComponent} from './app.component';
import {FeedService} from './feed.service';
import {FeedListComponent} from './feed-list/feed-list.component';
import {FeedEntryListComponent} from './feed-entry-list/feed-entry-list.component';
import {FeedEntryComponent} from './feed-entry/feed-entry.component';
import {StatsComponent} from './stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedListComponent,
    FeedEntryListComponent,
    FeedEntryComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [FeedService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
