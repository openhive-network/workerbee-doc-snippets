/**
 * Category: 🛠️ Custom Filters & Providers
 * Demo: filter() — create a custom filter with WAX API extension.
 *
 * This example demonstrates creating a custom filter that monitors if the current witness
 * is among the top HIVE token holders by combining blockchain data access
 * with real Hive API calls through WAX extension.
 * The filter triggers when the current witness is in the top holders list.
 *
 * Features Demonstrated:
 * - Creating and extending a chain with WAX Balance Tracker API
 * - Passing an explicit chain to WorkerBee
 * - Accessing blockchain data through the Data Evaluation Context (DEC)
 * - Making real API calls using the extended chain
 * - Checking if the current witness is among top token holders
 * - Custom conditional logic for complex monitoring scenarios
 */
import { createHiveChain } from '@hiveio/wax';
import WaxExtendedData, { BtrackerBackendNaiType } from '@hiveio/wax-api-balance-tracker';
import WorkerBee, { DynamicGlobalPropertiesClassifier } from '@hiveio/workerbee';

// Create a base chain
const chain = await createHiveChain();

// Extend the chain with WAX Balance Tracker API
const extendedChain = chain.extendRest(WaxExtendedData);

// Create WorkerBee with the extended chain
const bot = new WorkerBee({ explicitChain: extendedChain });
await bot.start();

bot.observe.provideBlockHeaderData().filter({
  async match(data) {
    // Access cached blockchain data through DEC
    const { currentWitness } = await data.get(DynamicGlobalPropertiesClassifier);

    // Make real API calls using the extended chain
    // Get top token holders from balance tracker API
    // Using the balance tracker API to get top HIVE holders
    const topHoldersResponse = await bot.chain.restApi.balanceApi.topHolders({
      "coin-type": BtrackerBackendNaiType.HIVE
    });

    // Check if current witness is among the top holders
    return topHoldersResponse.some(holder => holder.account === currentWitness);
  }
})
// Now you can subscribe your callback or use other filter chain conditions
.subscribe({
  next(data) {
    console.log(`Current witness "${data.block.witness}" is among the top HIVE holders!`);
  }
});
