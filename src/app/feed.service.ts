import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {Feed} from './models/feed';
import {FeedEntry} from './models/feed-entry';

@Injectable()
export class FeedService {
  private static feedParserUrl = 'https://api.rss2json.com/v1/api.json?rss_url=';
  private feedSubject: BehaviorSubject<Feed[]>;

  constructor(private http: HttpClient) {
    const cachedFeedsJson = localStorage.getItem('feeds');
    this.feedSubject = new BehaviorSubject<Feed[]>(cachedFeedsJson ? JSON.parse(cachedFeedsJson) : []);
    this.feedSubject.subscribe(feeds => localStorage.setItem('feeds', JSON.stringify(feeds)));
    this.updateAllFeeds();
    this.addFeed('https://github.com/RedGeekPanda/rss-on-angular/commits.atom').catch();
  }

  static withUrl(url: string): (_: { url }) => boolean {
    return obj => obj.url === url;
  }

  getFeeds(): Observable<Feed[]> {
    return this.feedSubject.asObservable();
  }

  getFeedEntries(feedUrl: string): Observable<FeedEntry[]> {
    return this.feedSubject.asObservable().map((feeds: Feed[]) => {
      const feed = feeds.find(FeedService.withUrl(feedUrl));
      return feed ? feed.entries : [];
    });
  }

  updateAllFeeds() {
    Promise.all(this.feedSubject.getValue().map(feed => this.fetchFeed(feed.url)))
      .then((feedFetchResponses: FeedFetchResponse[]) => {
        const feeds = this.feedSubject.getValue();
        feedFetchResponses.forEach(feedFetchResponse => {
          const feedFetchIndex = feeds.findIndex(feed => feed.url === feedFetchResponse.url);
          if (feedFetchIndex === -1) {
            return;
          }
          if (feedFetchResponse.status !== 'ok') {
            feeds[feedFetchIndex].url = '';
            return;
          }
          feeds[feedFetchIndex] = toFeed(feedFetchResponse);
        });
        this.feedSubject.next(feeds.filter(feed => feed.url));
      });
  }

  addFeed(feedUrl: string): Promise<any> {
    if (this.feedSubject.getValue().find(feed => feed.url === feedUrl)) {
      return Promise.resolve();
    }
    return this.fetchFeed(feedUrl)
      .then(feedFetchResponse => {
        if (feedFetchResponse.status !== 'ok') {
          return Promise.reject('No such Feed.');
        }
        const feeds = this.feedSubject.getValue();
        if (feeds.find(feed => feed.url === feedUrl)) {
          return Promise.resolve();
        }
        feeds.push(toFeed(feedFetchResponse));
        this.feedSubject.next(feeds);
        return Promise.resolve();
      });
  }

  removeFeed(feedUrl: string) {
    const feeds = this.feedSubject.getValue();
    const removeIndex = feeds.findIndex(feed => feed.url === feedUrl);
    if (removeIndex === -1) {
      return;
    }
    feeds.splice(removeIndex, 1);
    this.feedSubject.next(feeds);
  }

  private fetchFeed(feedUrl: string): Promise<FeedFetchResponse> {
    return this.http.get<FeedFetchResponse>(FeedService.feedParserUrl.concat(encodeURIComponent(feedUrl)))
      .toPromise()
      .then((feedFetchResponse: FeedFetchResponse) => {
        feedFetchResponse.url = feedUrl;
        console.log(`${feedFetchResponse.status}:`,
          feedFetchResponse.status === 'ok' ? feedFetchResponse.url : feedFetchResponse.message);
        return feedFetchResponse;
      });
  }
}

interface FeedFetchResponse {
  url: string;
  status: string;
  message: string;
  feed: any;
  items: any;
}

function toFeed(feedFetchResponse: FeedFetchResponse): Feed {
  return Object.assign({...feedFetchResponse.feed, entries: feedFetchResponse.items});
}
