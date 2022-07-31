import { config } from './config';
import { TwitterApi } from 'twitter-api-v2';

export const twitter = new TwitterApi({
    appKey: config.TWITTER_API_KEY,
    appSecret: config.TWITTER_API_SECRET,
    accessToken: config.TWITTER_ACCESS_TOKEN,
    accessSecret: config.TWITTER_ACCESS_TOKEN_SECRET,
  });

  