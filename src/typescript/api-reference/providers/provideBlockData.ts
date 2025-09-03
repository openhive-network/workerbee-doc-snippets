/**
 * Category: ⚙️ Blockchain Data Providers
 * Demo: provideBlockData() — provide comprehensive block information.
 *
 * This provider delivers complete block data including header information and full block content
 * with all transactions, operations, and witness signatures.
 * Block data includes comprehensive blockchain state information.
 *
 * Provider Function Inputs:
 * - No parameters required
 *
 * Callback Data:
 * The callback receives data of type {@link IBlockProviderData},
 * which is automatically deduced from the set of configured providers.
 */
import WorkerBee from "@hiveio/workerbee";

const bot = new WorkerBee();
await bot.start();

console.log("⏳ Monitoring blocks with full data...");

bot.observe.onBlock().provideBlockData().subscribe({
  /*
   * This observer will trigger on each new block and provide complete block data.
   * The callback receives comprehensive block information including all transactions
   * and operations contained within the block.
   */
  next(data) {
    console.log(`Block ${data.block.number} by @${data.block.witness}`);
    console.log(`Transactions: ${data.block.transactions.length}`);
    console.log(`Timestamp: ${data.block.timestamp}`);
  },
  error: console.error
});
