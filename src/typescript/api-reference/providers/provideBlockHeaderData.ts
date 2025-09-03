/**
 * Category: ⚙️ Blockchain Data Providers
 * Demo: provideBlockHeaderData() — provide essential block header information.
 *
 * This provider delivers lightweight block header data including block number, timestamp,
 * witness, and basic metadata without the overhead of full block content.
 * Header data provides essential timing and identification information.
 *
 * Provider Function Inputs:
 * - No parameters required
 *
 * Callback Data:
 * The callback receives data of type {@link IBlockHeaderProviderData},
 * which is automatically deduced from the set of configured providers.
 */
import WorkerBee from "@hiveio/workerbee";

const bot = new WorkerBee();
await bot.start();

console.log("⏳ Monitoring block headers...");

bot.observe.onPosts("guest4test").provideBlockHeaderData().subscribe({
  /*
   * This observer will trigger when account guest4test creates a new post and provide block header data.
   * The callback receives essential block timing and identification information
   * without the overhead of full block content processing.
   * This will allow to get for example the time when the post was created.
   */
  next(data) {
    data.posts["guest4test"]?.forEach(({ operation }) => {
      console.log(
        `New post created: ${operation.author}/${operation.permlink}. Creation date: ${data.block.timestamp.toISOString()}`
      );
    });
  },
  error: console.error
});
