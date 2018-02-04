import {FeedEntry} from './feed-entry';

export interface Feed {
  url: string;
  title: string;
  entries: FeedEntry[];
}
