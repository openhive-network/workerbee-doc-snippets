/**
 * Category: 🛠️ Custom Filters & Providers
 * Demo: provide() + filter() — mix provider with filter using WAX Balance Tracker API extension.
 *
 * This example demonstrates creating a custom filter that stores top holders data,
 * combined with a provider that retrieves and enriches this stored data. The workflow:
 * 1. Filter fetches top HIVE holders and stores data in cache
 * 2. Provider retrieves the stored data and enriches it with current witness info
 * 3. Only triggers when the current witness is among top holders
 *
 * Features Demonstrated:
 * - Creating and extending chain with WAX Balance Tracker API
 * - Mixing filter with provider in a single observation chain
 * - Storing custom data between filter and provider
 * - Data enrichment and transformation using real blockchain data
 * - Complex conditional logic combining multiple data sources
 */
import { createHiveChain } from '@hiveio/wax';
import WaxExtendedData, { BtrackerBackendNaiType } from '@hiveio/wax-api-balance-tracker';
import WorkerBee, { CollectorClassifierBase, DynamicGlobalPropertiesClassifier } from '@hiveio/workerbee';

// Create a base chain
const chain = await createHiveChain();

// Extend the chain with WAX Balance Tracker API
const extendedChain = chain.extendRest(WaxExtendedData);

// Create WorkerBee with the extended chain
const bot = new WorkerBee({ explicitChain: extendedChain });
await bot.start();

class TopHoldersClassifier extends CollectorClassifierBase<{ topHolders: string[] }> {}

bot.observe.provideBlockHeaderData().filter({
    async match(data) {
      // Access cached blockchain data through DEC
      const { currentWitness } = await data.get(DynamicGlobalPropertiesClassifier);

      // Get top token holders from balance tracker API
      const topHoldersResponse = await bot.chain.restApi.balanceApi.topHolders({
        "coin-type": BtrackerBackendNaiType.HIVE
      });

      const store = data.accessStore(TopHoldersClassifier);

      store.topHolders = topHoldersResponse.map(holder => holder.account);

      return store.topHolders.includes(currentWitness);
    }
  }).provide({
  async provide(data) {
    const topHoldersStore = data.accessStore(TopHoldersClassifier);

    return topHoldersStore;
  }
}).subscribe({
  // We created a custom filter so we will only get inside the next callback
  // when it evaluates to true - witness is one of the top holders.
  next(data) {
    // Indexing starts at 0 so we add 1 to get the rank
    const witnessIndex = data.topHolders.indexOf(data.block.witness) + 1;

    console.log(`🎯 WITNESS ALERT: Current witness is among top HIVE holders!`);
    console.log(`Current witness: ${data.block.witness} is rank #${witnessIndex}`);
  }
});
