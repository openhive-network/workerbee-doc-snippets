/**
 * Category: ⚙️ Blockchain Infrastructure
 * Demo: onBlock() — logs new block headers for a short duration.
 *
 * This is the foundational snippet that demonstrates WorkerBee's core concepts.
 * The observer triggers on every new block and provides comprehensive block header data.
 * No input parameters required as it monitors all blocks.
 *
 * Filter Function Inputs:
 * - No parameters required (monitors all new blocks)
 *
 * Callback Data:
 * The callback receives data of type {@link IBlockHeaderProviderData},
 * which is automatically deduced from the set of configured filters.
 */
import { createHiveChain } from "@hiveio/wax";
import WorkerBee from "@hiveio/workerbee";

const chain = await createHiveChain();
const bot = new WorkerBee(chain);
bot.start();

console.log("⏳ Listening for new blocks...");

bot.observe.onBlock().subscribe({
  /*
   * This observer will trigger on every new block produced on the blockchain.
   * The callback receives data of type {@link IBlockHeaderProviderData}, which includes:
   * - `data.block` - Contains complete block header information like id, number and timestamp
   */
  next(data) {
    console.log(`📦 Block #${data.block.number} id=${data.block.id} time=${data.block.timestamp}`);
  },
  error: console.error
});
