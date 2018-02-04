import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {Feed} from './models/feed';

@Injectable()
export class FeedsService {
  private feedParserUrl = 'https://api.rss2json.com/v1/api.json?rss_url=';
  private feedsSubject: BehaviorSubject<Feed[]>;

  constructor(private http: HttpClient) {
    const cachedFeedsJson = localStorage.getItem('feeds');
    this.feedsSubject = new BehaviorSubject<Feed[]>(cachedFeedsJson ? JSON.parse(cachedFeedsJson) : []);
    this.feedsSubject.subscribe(feeds => localStorage.setItem('feeds', JSON.stringify(feeds)));
    this.updateAllFeeds();
    this.addFeed('https://github.com/RedGeekPanda/rss-on-angular/commits.atom').catch();
  }

  get feeds() {
    return this.feedsSubject.asObservable();
  }

  updateAllFeeds() {
    Promise.all(this.feedsSubject.getValue().map(feed => this.fetchFeed(feed.url)))
      .then((feedFetchResponses: FeedFetchResponse[]) => {
        const feeds = this.feedsSubject.getValue();
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
        this.feedsSubject.next(feeds.filter(feed => feed.url));
      });
  }

  addFeed(feedUrl): Promise<any> {
    if (this.feedsSubject.getValue().find(feed => feed.url === feedUrl)) {
      return Promise.resolve();
    }
    return this.fetchFeed(feedUrl)
      .then(feedFetchResponse => {
        if (feedFetchResponse.status !== 'ok') {
          return Promise.reject('No such Feed.');
        }
        const feeds = this.feedsSubject.getValue();
        if (feeds.find(feed => feed.url === feedUrl)) {
          return Promise.resolve();
        }
        feeds.push(toFeed(feedFetchResponse));
        this.feedsSubject.next(feeds);
        return Promise.resolve();
      });
  }

  removeFeed(feedUrl) {
    const feeds = this.feedsSubject.getValue();
    const removeIndex = feeds.findIndex(feed => feed.url === feedUrl);
    if (removeIndex === -1) {
      return;
    }
    feeds.splice(removeIndex, 1);
    this.feedsSubject.next(feeds);
  }

  private fetchFeed(feedUrl): Promise<FeedFetchResponse> {
    return this.http.get<FeedFetchResponse>(this.feedParserUrl.concat(encodeURIComponent(feedUrl)))
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
