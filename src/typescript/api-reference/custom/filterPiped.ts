/**
 * Category: 🛠️ Custom Filters & Providers
 * Demo: filterPiped() — combine data provider with filter using WAX Balance Tracker API.
 *
 * This example demonstrates using filterPiped() to chain a data provider with a filter
 * for monitoring when the current witness is among top HIVE holders.
 * The provider function fetches top holders data, then the filter uses that data plus
 * current witness info to make conditional decisions.
 *
 * filterPiped() workflow:
 * - Provider function (first parameter) - Fetches top HIVE holders from Balance Tracker API
 *   - Returns enriched data with top holders list, current witness status, and rankings
 * - Filter function (second parameter) - Uses piped data + witness info to filter
 *   - Only triggers when current witness is a top holder
 *
 * Features Demonstrated:
 * - Creating and extending chain with WAX Balance Tracker API
 * - Using filterPiped() for simpler data flow than separate filter + provider
 * - Real Balance Tracker API integration for top holders
 * - Combining multiple data sources in a single observation
 * - Complex conditional logic with blockchain data
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

bot.observe
  .provideBlockHeaderData()
  .filterPiped(
    // Provider function - fetches top HIVE holders and enriches data
    async () => {
      // Get top token holders from balance tracker API
      const topHoldersResponse = await bot.chain.restApi.balanceApi.topHolders({
        "coin-type": BtrackerBackendNaiType.HIVE
      });

      return { topHolders: topHoldersResponse.map(holder => holder.account) };
    },
    // Filter function - uses piped data to determine if conditions are met
    async (pipedData, data) => {
      // Get current witness from DEC
      const { currentWitness } = await data.get(DynamicGlobalPropertiesClassifier);

      // Only proceed if current witness is a top holder
      return pipedData.topHolders.includes(currentWitness);
    }
  )
  // Now you can subscribe your callback or use other filter chain conditions
  .subscribe({
    next(data) {
      // Access the piped data from the provider function
      console.log(`🎯 WITNESS ALERT: Current witness is among top HIVE holders!`);
      console.log(`Current witness: ${data.block.witness}`);
    }
  });
