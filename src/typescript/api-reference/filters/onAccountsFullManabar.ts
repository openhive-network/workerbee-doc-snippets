/**
 * Category: 👤 Account Management
 * Demo: onAccountsFullManabar() — notify when accounts reach 98% manabar.
 *
 * This observer monitors manabar levels and triggers when any specified account reaches 98% manabar capacity.
 * You can specify a manabar kind to be monitored (expressed by values of {@link EManabarType}).
 * Multiple account names can be observed at single observer call.
 *
 * Filter Function Inputs:
 * - `manabarType: EManabarType` - The type of manabar to monitor (RC, UPVOTE, or DOWNVOTE)
 * - `...accounts: TAccountName[]` - Account names to monitor for full manabar
 *
 * Callback Data:
 * The callback receives data of type {@link IManabarProviderData},
 * which is automatically deduced from the set of configured filters.
 */
import { createHiveChain, EManabarType } from "@hiveio/wax";
import WorkerBee from "@hiveio/workerbee";

const chain = await createHiveChain();
const bot = new WorkerBee(chain);
bot.start();

console.log("⏳ Watching for accounts with full RC manabar...");

bot.observe.onAccountsFullManabar(EManabarType.RC, "guest4test", "guest4test1").subscribe({
  /*
   * This observer will trigger when either guest4test or guest4test1 reaches 98% RC manabar.
   * The callback receives data of type {@link IManabarProviderData}, which includes:
   * - `data.manabarData` - Contains manabar information for each monitored account
   * The callback receives data for all monitored account even if only one reaches 98% manabar.
   * The rest of the accounts will point to undefined so you should check for their existence before accessing their properties.
   */
  next(data) {
    if (data.manabarData.guest4test)
      console.log(`⚡ Account guest4test has ${data.manabarData.guest4test?.[EManabarType.RC]?.percent}% RC manabar!`);
  },
  error: console.error
});
