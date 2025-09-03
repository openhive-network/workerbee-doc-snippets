/**
 * Category: 👤 Account Data Providers
 * Demo: provideWitnesses() — provide comprehensive witness information.
 *
 * This provider delivers detailed witness data including owner, version and block production performance.
 * Multiple witnesses can be monitored simultaneously.
 *
 * Provider Function Inputs:
 * - `...witnesses: TAccountName[]` - Witness names to provide data for
 *
 * Callback Data:
 * The callback receives data of type {@link IWitnessProviderData},
 * which is automatically deduced from the set of configured providers.
 */
import WorkerBee from "@hiveio/workerbee";

const bot = new WorkerBee();
await bot.start();

console.log("⏳ Monitoring witness data...");

bot.observe.onBlock().provideWitnesses("guest4test", "guest4test1").subscribe({
  /*
   * This observer will trigger on each new block and provide witness data.
   * The callback receives comprehensive witness information including performance metrics for the specified witnesses.
   */
  next(data) {
    for (const witness in data.witnesses) {
      const witnessData = data.witnesses[witness];
      if (witnessData)
        console.log(`Witness ${witness}:`, witnessData);
      }
  },
  error: console.error
});
