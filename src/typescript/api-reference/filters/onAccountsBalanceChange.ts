/**
 * Category: 🏦 Financial Operations
 * Demo: onAccountsBalanceChange() — monitor account balance updates.
 *
 * This observer triggers when account balances change due to transfers, rewards,
 * or other financial operations. You can specify whether to include internal
 * balance changes and monitor multiple accounts.
 *
 * Filter Function Inputs:
 * - `includeInternal: boolean` - Whether to include internal balance changes
 * - `...accounts: TAccountName[]` - Account names to monitor for balance changes
 *
 * Callback Data:
 * There is no callback data for this observer.
 */
import { createHiveChain } from "@hiveio/wax";
import WorkerBee from "@hiveio/workerbee";

const chain = await createHiveChain();
const bot = new WorkerBee(chain);
bot.start();

console.log("⏳ Watching for balance changes...");

bot.observe.onAccountsBalanceChange(true, "guest4test", "guest4test1").subscribe({
  /*
   * This observer will trigger when guest4test or guest4test1 has a balance change.
   * Balance changes include transfers, rewards, power ups/downs, and savings operations.
   * There is no callback data for this observer - it simply notifies when the change in any of monitored accounts occurs.
   */
  next(data) {
    for (const accountData of Object.values(data.accounts))
      console.log("New Balance:", accountData?.balance.HBD.total);
  },
  error: console.error
});
