/**
 * Category: 🏦 Financial Operations
 * Demo: onExchangeTransfer() — monitor transfers to/from known exchanges.
 *
 * This observer triggers when transfers involve known exchange accounts.
 * WorkerBee maintains a list of known exchanges automatically, monitoring
 * both deposits to and withdrawals from these exchange accounts.
 *
 * Filter Function Inputs:
 * - No parameters required (monitors all transfers involving known exchanges)
 *
 * Callback Data:
 * The callback receives data of type {@link IExchangeTransferProviderData},
 * which is automatically deduced from the set of configured filters.
 */
import { createHiveChain } from "@hiveio/wax";
import WorkerBee from "@hiveio/workerbee";

const chain = await createHiveChain();
const bot = new WorkerBee(chain);
bot.start();

console.log("⏳ Watching for exchange transfers...");

bot.observe.onExchangeTransfer().subscribe({
  /*
   * This observer will trigger when transfers involve known exchange accounts.
   * The callback receives data of type {@link IExchangeTransferProviderData}, which includes:
   * - `data.exchangeTransferOperations` - Array of transfer-operation pairs involving exchanges
   * Each transaction/operation contains transfer details with standard hive transfer properties.
   */
  next(data) {
    data.exchangeTransferOperations.forEach(({ operation }) => {
      console.log(`🏦 Exchange transfer: ${operation.from} -> ${operation.to} (${operation.amount})`);
    });
  },
  error: console.error
});
