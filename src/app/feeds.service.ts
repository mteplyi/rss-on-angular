import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';

import {Feed} from './models/feed';
import {FeedEntry} from './models/feed-entry';

@Injectable()
export class FeedsService {
  private feedParserUrl = 'https://rss2json.com/api.json?rss_url=';
  private feedUrls;
  public feeds: Observable<Feed[]>;

  constructor(private http: HttpClient) {
    this.feedUrls = [
      'https://github.com/RedGeekPanda/rss-on-angular/commits/master.atom',
      'https://github.com/RedGeekPanda/rss-on-angular/commits/dev.atom'
    ];
    this.feeds = Observable.combineLatest<Feed>(this.feedUrls.map(feedUrl => this.getFeed(feedUrl)));
  }

  private getFeed(feedUrl): Observable<Feed> {
    return this.http.get(this.feedParserUrl.concat(feedUrl))
      .map((feedParserResponse: FeedParserResponse) => {
        console.log(feedParserResponse.status, feedParserResponse.feed.url);
        return {
          title: feedParserResponse.feed.title,
          entries: feedParserResponse.items
        };
      });
  }
}

interface FeedParserResponse {
  status: string;
  feed: { title, url };
  items: FeedEntry[];
}
