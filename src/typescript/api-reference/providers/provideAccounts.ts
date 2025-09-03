/**
 * Category: 👤 Account Data Providers
 * Demo: provideAccounts() — provide comprehensive account information for specified accounts.
 *
 * This provider enriches your filter data with detailed account information including balances,
 * voting power, profile metadata, and recovery account.
 * Multiple account names can be provided in a single provider call.
 *
 * Provider Function Inputs:
 * - `...accounts: TAccountName[]` - Account names to provide data for
 *
 * Callback Data:
 * The callback receives data of type {@link IAccountProviderData},
 * which is automatically deduced from the set of configured providers.
 */
import WorkerBee from "@hiveio/workerbee";

const bot = new WorkerBee();
await bot.start();

console.log("⏳ Monitoring blocks with account data...");

bot.observe.onBlock().provideAccounts("guest4test", "guest4test1").subscribe({
  /*
   * This observer will trigger on each new block and provide account data.
   * The callback receives data that includes both block information and account details.
   * Account data includes balances, voting power, and other account properties.
   */
  next(data) {
    console.log("Block:", data.block.number);
    console.log("Account 1 data:", data.accounts["guest4test"]);
    console.log("Account 2 data:", data.accounts["guest4test1"]);
  },
  error: console.error
});
