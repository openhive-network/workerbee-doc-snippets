/**
 * Category: 👥 Social & Content
 * Demo: onFollow() — watch follow/mute/blacklist events emitted by accounts.
 *
 * This observer monitors social graph changes on the Hive blockchain including
 * follow actions, mute actions, and blacklist actions. Tracks relationship changes
 * between accounts. Multiple accounts can be monitored simultaneously.
 *
 * Filter Function Inputs:
 * - `...accounts: TAccountName[]` - Account names to monitor for follow/mute/blacklist activity
 *
 * Callback Data:
 * The callback receives data of type {@link IFollowProviderData},
 * which is automatically deduced from the set of configured filters.
 */
import { createHiveChain } from "@hiveio/wax";
import WorkerBee from "@hiveio/workerbee";

const chain = await createHiveChain();
const bot = new WorkerBee(chain);
bot.start();

console.log("⏳ Watching for follow events...");

bot.observe.onFollow("guest4test", "guest4test1").subscribe({
  /*
   * This observer will trigger when guest4test or guest4test1 performs follow/mute/blacklist actions.
   * The callback receives data of type {@link IFollowProviderData}, which includes:
   * - `data.follows` - Contains follow transaction/operation pairs grouped by account
   * Remember to check if follows for specific account actually exist when observing multiple accounts.
   */
  next(data) {
    if (data.follows.guest4test)
      data.follows.guest4test?.forEach(({ operation }) => {
        console.log(`🧭 Follow event by guest4test: @${operation.follower} -> @${operation.following} (${operation.what})`);
      });
  },
  error: console.error
});
