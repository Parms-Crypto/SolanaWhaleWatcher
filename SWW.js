// Made by @ParmsCrypto
// Free RPC Don't abuse or won't last for everyone!
const url = `https://mainnet.helius-rpc.com/?api-key=2a06f4bd-c0a7-4652-91be-06ef4791201b`;
const fs = require("fs");
const { Connection, PublicKey } = require('@solana/web3.js');
const ARB_TOKEN = '9tzZzEHsKnwFL1A3DyFJwj36KnZj3gZ7g4srWp9YTEoh';
const jsonArray = [];
let paddedTotalBalance = '';
global.BigInt = global.BigInt || require('bigInt');

const getTokenAccounts = async () => {
  const fetch = (await import("node-fetch")).default;
  let page = 1;
  let allOwners = new Set();

  while (true) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "getTokenAccounts",
        id: "Parms",
        params: {
          page: page,
          limit: 1000,
          displayOptions: {},
          mint: "9tzZzEHsKnwFL1A3DyFJwj36KnZj3gZ7g4srWp9YTEoh",
        },
      }),
    });
    const data = await response.json();

    if (!data.result || data.result.token_accounts.length === 0) {
      break;
    }

    data.result.token_accounts.forEach((account) =>
      allOwners.add(account.owner)
    );
    page++;
  }

  jsonArray.length = 0;
  jsonArray.push(...Array.from(allOwners));

  fs.writeFileSync("output.json", JSON.stringify(jsonArray, null, 2));
};

async function checkTokenBalance() {
  try {
    // Free RPC Don't abuse or won't last for everyone!
	const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=2a06f4bd-c0a7-4652-91be-06ef4791201b');
	// Donate to this publickey if you like the project!
    const walletPublicKey = new PublicKey('CGvMJVAFpiLjMDH3cXrbbVQ91m3KgZvVwRCoACRfYG5G');

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
      mint: new PublicKey(ARB_TOKEN)
    });

    let totalTokenBalance = BigInt(0);

    if (tokenAccounts.value) {
      tokenAccounts.value.forEach((accountInfo) => {
        try {
          const parsedInfo = accountInfo.account.data.parsed.info;
          totalTokenBalance += BigInt(parsedInfo.tokenAmount.amount);
        } catch (error) {
          console.error(`Token Account ${accountInfo.pubkey.toBase58()} has no valid token data.`);
        }
      });

      const adjustedBalance = totalTokenBalance / BigInt(1000000);
    } else {
      console.log(`No token accounts found for ${walletPublicKey.toBase58()}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function processWallets() {
  try {
    const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=c8915716-f1a5-4562-9cbd-1f9b70fa43ba');
    const walletAddresses = JSON.parse(fs.readFileSync('output.json', 'utf8'));

    if (!walletAddresses || walletAddresses.length === 0) {
      console.log('No wallet addresses found in output.json');
      return;
    }

    const results = [];
    const accountsPerPage = 10;

    for (let i = 0; i < walletAddresses.length; i++) {
      const walletAddress = walletAddresses[i];
      const publicKey = new PublicKey(walletAddress);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(ARB_TOKEN)
      });

      let totalTokenBalance = BigInt(0);

      if (tokenAccounts.value) {
        tokenAccounts.value.forEach((accountInfo) => {
          try {
            const parsedInfo = accountInfo.account.data.parsed.info;
            totalTokenBalance += BigInt(parsedInfo.tokenAmount.amount);
          } catch (error) {
            console.error(`Token Account ${accountInfo.pubkey.toBase58()} has no valid token data.`);
          }
        });

        const adjustedBalance = totalTokenBalance / BigInt(100000);

        if (adjustedBalance !== BigInt(0)) {
          const existingAccountIndex = results.findIndex((result) => result.wallet === publicKey.toBase58());

          if (existingAccountIndex !== -1) {
            results[existingAccountIndex].balance = adjustedBalance.toString();
          } else {
            results.push({ wallet: publicKey.toBase58(), balance: adjustedBalance.toString() });
          }

          if (i >= 10) {
            console.log(` ${publicKey.toBase58().length === 43 ? ' ' : ''}${publicKey.toBase58()}: ${adjustedBalance.toString().padStart(10, ' ')}`);
          }
        } else {
          // console.log(`Skipping account with zero balance: ${publicKey.toBase58()}`);
        }

        if ((i + 1) % accountsPerPage === 0 && i !== walletAddresses.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust timing as needed

          fs.writeFileSync('output2.json', JSON.stringify(results, null, 2));
          console.log('Results written to output2.json');

          display2();
        }
      } else {
        console.log(`No token accounts found for ${publicKey.toBase58()}`);
        processWallets();
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function sortBalances() {
  try {
    if (!fs.existsSync('output2.json')) {
      fs.writeFileSync('output2.json', '[]', 'utf8');
    }
    if (!fs.existsSync('output3.json')) {
      fs.writeFileSync('output3.json', '[]', 'utf8');
    }
    if (!fs.existsSync('output4.json')) {
      fs.writeFileSync('output4.json', '[]', 'utf8');
    }
    if (!fs.existsSync('output5.json')) {
      fs.writeFileSync('output5.json', '[]', 'utf8');
    }

    const balances = JSON.parse(fs.readFileSync('output2.json', 'utf8'));

    if (!balances || balances.length === 0) {
      console.log('No balances found in output2.json');
      return;
    }

    const sortedBalances = balances.sort((a, b) => {
      const balanceA = parseFloat(a.balance);
      const balanceB = parseFloat(b.balance);
      return balanceB - balanceA;
    });

    fs.writeFileSync('output3.json', JSON.stringify(sortedBalances, null, 2));

    const differences = JSON.parse(fs.readFileSync('output5.json', 'utf8'));

    console.log('Solana Whale Watcher v1.0.0');
    console.log('Powered by @ParmsCrypto');
    console.log(' ');
    console.log('--------------------------------------------------------------------------');
    console.log(`Total ARB Holders: ${jsonArray.length}`.padStart(47, ' '));
    console.log(`Finding ARB Circulating Supply: ${paddedTotalBalance}`.padStart(57, ' '));
    console.log('TOP 25 ARB WALLETS AND BALANCES:'.padStart(52, ' '));
    console.log('--------------------------------------------------------------------------');

    let previousRank = -1;

    for (let i = 0; i < Math.min(25, sortedBalances.length); i++) {
      const wallet = sortedBalances[i];
      const formattedBalance = (wallet.balance / 10).toLocaleString(undefined, { maximumFractionDigits: 0 });
      const halfPadding = Math.floor((44 - wallet.wallet.length) / 2);
      const paddedWallet = `\x1b[36m${wallet.wallet.length === 43 ? ' ' : ''}${wallet.wallet.padStart(halfPadding + wallet.wallet.length, ' ')}\x1b[0m`;
      const ranking = (i + 1).toString().padStart(3, ' ');
      const greenColorStart = '\x1b[32m';
      const redColorStart = '\x1b[31m';
      const whiteColorStart = '\x1b[37m';
      const colorEnd = '\x1b[0m';
      const differenceEntry = differences.find(entry => entry.wallet === wallet.wallet);
      const rankChange = previousRank !== -1 ? i - previousRank : 0;
      previousRank = i;
      const balanceColor =
        differenceEntry
          ? differenceEntry.balanceDifference > 0
            ? greenColorStart
            : differenceEntry.balanceDifference < 0
            ? redColorStart
            : whiteColorStart
          : whiteColorStart;
      const rankColor =
        differenceEntry
          ? differenceEntry.rankDifference > 0
            ? greenColorStart
            : differenceEntry.rankDifference < 0
            ? redColorStart
            : whiteColorStart
          : whiteColorStart;

      // future update 
      if (i < 10) {
        console.log(`Rank: ${rankColor}${ranking}${colorEnd} | ${paddedWallet} | \x1b[35mARB\x1b[0m: ${balanceColor}${formattedBalance.padStart(10, ' ')}${colorEnd}`);
      } else {
        console.log(`Rank: ${rankColor}${ranking}${colorEnd} | ${paddedWallet} | \x1b[35mARB\x1b[0m: ${balanceColor}${formattedBalance.padStart(10, ' ')}${colorEnd}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function calculateTotalBalance() {
  try {
    const jsonData = fs.readFileSync('output2.json', 'utf8');
    const jsonArray = JSON.parse(jsonData);

    if (!jsonArray || jsonArray.length === 0) {
      console.log('No contents found in output2.json. Exiting calculateTotalBalance.');
      return;
    }

    const totalBalance = jsonArray.reduce((total, entry) => {
      return total + entry.balance / 10;
    }, 0);

    const formattedTotalBalance = totalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 });
    paddedTotalBalance = formattedTotalBalance.padStart(10, ' '); 
  } catch (error) {
    console.error('Error:', error);
  }
}

async function updateMainDisplay() {
	console.clear();
	console.log(`Solana Whale Watcher v1.0.0`);
	await getTokenAccounts();
	await checkTokenBalance();
	await duplicateOutput3();	
	await processWallets();
	await sortBalances();
}

async function display2() {
	console.clear();
	compareOutputsAndSaveDifference();
	await sortBalances();
	console.log('--------------------------------------------------------------------------');
	await calculateTotalBalance();
	console.log('');
	console.log('Updating Balances...');
	console.log('--------------------');
}

 updateMainDisplay();
 copyOutputsToMasterLists();

async function duplicateOutput3() {
  try {
    const output3Data = fs.readFileSync('output3.json', 'utf8');
    const output3Array = JSON.parse(output3Data);
    const output4Array = [...output3Array];

    fs.writeFileSync('output4.json', JSON.stringify(output4Array, null, 2));
  
  } catch (error) {
    console.error('Error:', error);
  }
}

async function compareOutputsAndSaveDifference() {
  try {
    const output3Data = fs.readFileSync('output3.json', 'utf8');
    const output4Data = fs.readFileSync('output4.json', 'utf8');
    const output3Array = JSON.parse(output3Data);
    const output4Array = JSON.parse(output4Data);
    const differencesArray = [];

    for (const output4Entry of output4Array) {
      const matchingOutput3Entry = output3Array.find(
        (output3Entry) => output3Entry.wallet === output4Entry.wallet
      );

      if (matchingOutput3Entry) {
        const balanceDifference = BigInt(output4Entry.balance) - BigInt(matchingOutput3Entry.balance);

        if (balanceDifference !== 0n) {
          const rankDifference = output3Array.findIndex(entry => entry.wallet === matchingOutput3Entry.wallet) -
            output4Array.findIndex(entry => entry.wallet === output4Entry.wallet);
		  // tweak this solution, ? rankChangeLabel = rankDifference >= 0n ? '+' : '-';
		  const rankChangeLabel = rankDifference > 0 ? '+' : (rankDifference < 0 ? '-' : '');

          differencesArray.push({
            wallet: output4Entry.wallet,
            balanceDifference: balanceDifference > 0n ? `+${balanceDifference.toString()}` : balanceDifference.toString(),
            rankDifference: `${rankChangeLabel}${Math.abs(rankDifference)}`,
          });
        }
      } else {
        differencesArray.push({
          wallet: output4Entry.wallet,
          balanceDifference: `+${output4Entry.balance}`,
          rankDifference: `-${output4Array.findIndex(entry => entry.wallet === output4Entry.wallet)}`,
        });
      }
    }

    fs.writeFileSync('output5.json', JSON.stringify(differencesArray, null, 2));

	copyOutputsRecentChangeList()
	
  } catch (error) {
    console.error('Error:', error);
  }
}

async function copyOutputsRecentChangeList() {
  try {
    const outputData5 = fs.readFileSync('output5.json', 'utf8');
    const output5Array = JSON.parse(outputData5);

    if (!fs.existsSync('recentchangelist.json')) {
      fs.writeFileSync('recentchangelist.json', '[]', 'utf8');
    }

    const recentChangeListData = fs.readFileSync('recentchangelist.json', 'utf8');
    let recentChangeListArray = JSON.parse(recentChangeListData);
    const holdersBalancesData = fs.readFileSync('Holders_Master.json', 'utf8');
    const holdersBalancesArray = JSON.parse(holdersBalancesData);
    const output4Data = fs.readFileSync('output4.json', 'utf8');
    const output4Array = JSON.parse(output4Data);

    output5Array.forEach((entry5) => {
      // needs editing/fixing
      const existingEntryIndex = recentChangeListArray.findIndex((entry) => entry.wallet === entry5.wallet);
      const balance = entry5.balance || '0';

      if (existingEntryIndex !== -1) {
        // fix triggers-mapping for rank movements for upgrade 
        const existingEntry = recentChangeListArray[existingEntryIndex];
        const holdersBalance = holdersBalancesArray.find((holdersBalancesEntry) => holdersBalancesEntry.wallet === entry5.wallet)?.balance || '0';
        const output4Balance = output4Array.find((output4Entry) => output4Entry.wallet === entry5.wallet)?.balance || '0';
        const balancedifference = BigInt(holdersBalance) - BigInt(output4Balance);
        const rankDifference = entry5.rankDifference || '0';
        const sign = balancedifference >= 0n ? '+' : '-';
        const absDifference = balancedifference >= 0n ? balancedifference : -balancedifference;

        recentChangeListArray[existingEntryIndex] = {
          ...existingEntry,
          // Format note +,- triggers are tricky!
		  balanceDifference: `${sign}${absDifference}`,
          // Mapping entry for future updates-customization.
		  rankDifference: rankDifference,
          balance: holdersBalance
        };
      } else {
        const rankInHoldersBalances = holdersBalancesArray.findIndex((holdersBalancesEntry) => holdersBalancesEntry.wallet === entry5.wallet);
        const rank = rankInHoldersBalances !== -1 ? rankInHoldersBalances + 1 : 0;

        recentChangeListArray.push({
          wallet: entry5.wallet,
          balance: holdersBalancesArray.find((holdersBalancesEntry) => holdersBalancesEntry.wallet === entry5.wallet)?.balance || '0',
          balanceDifference: entry5.balanceDifference,
          rankDifference: entry5.rankDifference || '0',
          rank: rank
        });
      }
    });

    fs.writeFileSync('recentchangelist.json', JSON.stringify(recentChangeListArray, null, 2), 'utf8');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function copyOutputsToMasterLists() {
  try {
    const outputData1 = fs.readFileSync('output.json', 'utf8');
    if (!fs.existsSync('holders.json')) {
      fs.writeFileSync('holders.json', outputData1, 'utf8');
    } else {
      console.log('holders.json already exists. Skipping copy from output.json.');
    }
	
    const outputData3 = fs.readFileSync('output3.json', 'utf8');

    if (!fs.existsSync('holdersbalances.json')) {
      fs.writeFileSync('holdersbalances.json', outputData3, 'utf8');
      console.log('Contents copied from output3.json to holdersbalances.json.');
    } else {
      console.log('holdersbalances.json already exists. Skipping copy from output3.json.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
     console.log('To obtain a new copy of these files, manually delete and restart.')
}








