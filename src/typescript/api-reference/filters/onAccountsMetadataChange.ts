/**
 * Category: 👤 Account Management
 * Demo: onAccountsMetadataChange() — watch accounts for metadata updates.
 *
 * This observer triggers when accounts update their profile data or other metadata via account_update operations.
 * Multiple account names can be observed at single observer call.
 *
 * Filter Function Inputs:
 * - `...accounts: TAccountName[]` - Account names to monitor for metadata changes
 *
 * There is no callback data for this observer.
 */
import { createHiveChain } from "@hiveio/wax";
import WorkerBee from "@hiveio/workerbee";

const chain = await createHiveChain();
const bot = new WorkerBee(chain);
bot.start();

console.log("⏳ Watching for account metadata changes...");

bot.observe.onAccountsMetadataChange("guest4test", "guest4test1").subscribe({
  /*
   * This observer will trigger when guest4test or guest4test1 updates their account metadata.
   * Account metadata changes include profile updates.
   * There is no callback data for this observer - it simply notifies when any of monitored accounts change the metadata.
   */
  next(data) {
    for (const [account, accountData] of Object.entries(data.accounts)) {
      console.log(`👤 Account metadata changed for: ${account}, ${accountData?.jsonMetadata}`);
    }
  },
  error: console.error
});
