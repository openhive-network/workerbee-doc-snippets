/**
 * Category: 🏦 Financial Data Providers
 * Demo: provideFeedPriceData() — provide comprehensive HIVE price feed information.
 *
 * This provider delivers complete price feed data including current prices, historical data,
 * and statistical price information from witness-published feeds.
 * Price data includes median, minimum, and maximum values with historical trends.
 *
 * Provider Function Inputs:
 * - No parameters required
 *
 * Callback Data:
 * The callback receives data of type {@link IFeedPriceProviderData},
 * which is automatically deduced from the set of configured providers.
 */
import WorkerBee from "@hiveio/workerbee";

const bot = new WorkerBee();
await bot.start();

console.log("⏳ Monitoring with price feed data...");

bot.observe.onBlock().provideFeedPriceData().subscribe({
  /*
   * This observer will trigger on each new block and provide price feed data.
   * The callback receives comprehensive price information including current rates,
   * historical data, and statistical price metrics from witness feeds.
   */
  next(data) {
    console.log("Current HIVE price:", data.feedPrice.currentMedianHistory);
    console.log("Price range:", data.feedPrice.currentMinHistory, "-", data.feedPrice.currentMaxHistory);
  },
  error: console.error
});
