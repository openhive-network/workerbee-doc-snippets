/**
 * Category: 👤 Account Data Providers
 * Demo: provideRcAccounts() — provide comprehensive RC account information.
 *
 * This provider delivers detailed resource credit system data including current balance,
 * maximum capacity, regeneration rates, and last update time for specified accounts.
 * Multiple accounts can be monitored simultaneously.
 *
 * Provider Function Inputs:
 * - `...accounts: TAccountName[]` - Account names to provide RC data for
 *
 * Callback Data:
 * The callback receives data of type {@link IRcAccountProviderData},
 * which is automatically deduced from the set of configured providers.
 */
import WorkerBee from "@hiveio/workerbee";

const bot = new WorkerBee();
await bot.start();

console.log("⏳ Monitoring RC account data...");

bot.observe.onBlock().provideRcAccounts("guest4test", "guest4test1").subscribe({
  /*
   * This observer will trigger on each new block and provide RC account data.
   * The callback receives detailed resource credit information for the specified accounts.
   * RC data includes current balance, maximum capacity, and last update time.
   */
  next(data) {
    for (const account in data.rcAccounts) {
      const rcData = data.rcAccounts[account];

      if (rcData)
        console.log(`${account} RC details:`, rcData);
    }
  },
  error: console.error
});
