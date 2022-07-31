import { ETwitterStreamEvent, TweetV1 } from "twitter-api-v2";
import { config } from "./config";
import { checkText, filterTweetText } from "./grammar";
import { twitter } from "./twitter";
import { promises as fs } from "fs";

function onTweet(tweet: TweetV1) {
  console.log(tweet);
}

async function run() {
  try {
    const streamFilter = await twitter.v1.filterStream({
      track: ["seit", "seid"],
    });

    streamFilter.on(ETwitterStreamEvent.Data, async (tweet: any) => {
      try {
        if (tweet.user.screen_name === config.TWITTER_OWNER_SCREEN_NAME) {
          return;
        }

        const moreTweetData: any = await twitter.v1.singleTweet(tweet.id_str, {
          tweet_mode: "extended",
        });

        if (!moreTweetData.user.following) {
          return;
        }

        let text = tweet.text;
        if (tweet.truncated) {
          text = tweet.extended_tweet?.text;
        }

        if (!text) {
          return;
        }

        const response = await filterTweetText(text);

        if (response) {
          await twitter.v1.tweet(response, {
            in_reply_to_status_id: tweet.id_str,
            auto_populate_reply_metadata: true,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);

    setTimeout(run, 20000);
  }
}

run();
