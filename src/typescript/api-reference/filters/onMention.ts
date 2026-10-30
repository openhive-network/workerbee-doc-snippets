/**
 * Category: 👥 Social & Content
 * Demo: onMention() — detect account mentions in posts/comments.
 *
 * This observer monitors when specific accounts are mentioned in post and comment
 * content using @username syntax. Essential for social engagement applications
 * and notification systems. Multiple accounts can be monitored simultaneously.
 *
 * Filter Function Inputs:
 * - `...accounts: TAccountName[]` - Account names to monitor for mentions
 *
 * Callback Data:
 * The callback receives data of type {@link IMentionedAccountProviderData},
 * which is automatically deduced from the set of configured filters.
 */
import { createHiveChain } from "@hiveio/wax";
import WorkerBee from "@hiveio/workerbee";

const chain = await createHiveChain();
const bot = new WorkerBee(chain);
bot.start();

console.log("⏳ Watching for mentions...");

bot.observe.onMention("guest4test", "guest4test1").subscribe({
  /*
   * This observer will trigger when guest4test or guest4test1 is mentioned in content.
   * The callback receives data of type {@link IMentionedAccountProviderData}, which includes:
   * - `data.mentioned` - Contains mention instances (comment_operation) grouped by mentioned account
   * Remember to check if mentions for specific account actually exist when observing multiple accounts.
   */
  next(data) {
    data.mentioned.guest4test?.forEach(comment => {
      console.log(`📣 @guest4test mentioned by @${comment.author}`);
    });
    data.mentioned.guest4test1?.forEach(comment => {
      console.log(`📣 @guest4test1 mentioned by @${comment.author}`);
    });
  },
  error: console.error
});
