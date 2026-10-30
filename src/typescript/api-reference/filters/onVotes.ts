/**
 * Category: 👥 Social & Content
 * Demo: onVotes() — monitor voting activity by specific accounts.
 *
 * This observer monitors voting activity on the Hive blockchain. Tracks upvotes
 * and downvotes by specific accounts with detailed voting information including
 * vote weight and target content. Multiple voters can be monitored simultaneously.
 *
 * Filter Function Inputs:
 * - `...voters: TAccountName[]` - Voter account names to monitor for voting activity
 *
 * Callback Data:
 * The callback receives data of type {@link IVoteProviderData},
 * which is automatically deduced from the set of configured filters.
 */
import { createHiveChain } from "@hiveio/wax";
import WorkerBee from "@hiveio/workerbee";

const chain = await createHiveChain();
const bot = new WorkerBee(chain);
bot.start();

console.log("⏳ Watching for votes...");

bot.observe.onVotes("guest4test", "guest4test1").subscribe({
  /*
   * This observer will trigger when guest4test or guest4test1 casts a vote.
   * The callback receives data of type {@link IVoteProviderData}, which includes:
   * - `data.votes` - Contains vote transaction/operation pairs grouped by voter
   * Remember to check if votes for specific voter actually exist when observing multiple voters.
   */
  next(data) {
    if (data.votes.guest4test)
      data.votes.guest4test?.forEach(({ operation }) => {
        console.log(`👍 @guest4test voted: ${operation.author}/${operation.permlink} (weight: ${operation.weight})`);
      });
  },
  error: console.error
});
