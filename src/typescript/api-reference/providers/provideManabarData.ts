/**
 * Category: 👤 Account Data Providers
 * Demo: provideManabarData() — provide detailed manabar information for specified accounts.
 *
 * This provider delivers comprehensive manabar data including current levels, last update time,
 * and percentage capacity for specified accounts and manabar types.
 * Multiple accounts can be monitored simultaneously.
 *
 * Provider Function Inputs:
 * - `manabarType: EManabarType` - The type of manabar to monitor (RC, UPVOTE, or DOWNVOTE)
 * - `...accounts: TAccountName[]` - Account names to provide manabar data for
 *
 * Callback Data:
 * The callback receives data of type {@link IManabarProviderData},
 * which is automatically deduced from the set of configured providers.
 */
import { createHiveChain, EManabarType } from "@hiveio/wax";
import WorkerBee from "@hiveio/workerbee";

const chain = await createHiveChain();
const bot = new WorkerBee(chain);
bot.start();

console.log("⏳ Monitoring manabar data...");

bot.observe.onBlock().provideManabarData(EManabarType.UPVOTE, "guest4test", "guest4test1").subscribe({
  /*
   * This observer will trigger on each new block and provide manabar data.
   * The callback receives manabar information for the specified accounts and manabar type.
   * Manabar data includes current mana, max mana, and percentage values.
   */
  next(data) {
    for (const [account, manabars] of Object.entries(data.manabarData)) {
      const upvoteManabar = manabars?.[EManabarType.UPVOTE];

      if (upvoteManabar)
        console.log(`${account} upvote manabar: ${upvoteManabar.percent}% (${upvoteManabar.currentMana}/${upvoteManabar.max})`);
    }
  },
  error: console.error
});
