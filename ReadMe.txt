Thank you for checking out my program!
* Developer for hire - specializing in old school CLI *
* Custom work avilable send inquiries @ParmsCrypto *
* Solana Donation Account: CGvMJVAFpiLjMDH3cXrbbVQ91m3KgZvVwRCoACRfYG5G *

Motivation for this program is dedicated to the good people at ARB Protocol.
You can check them out at https://github.com/ARBProtocol   https://twitter.com/ArbProtocol

I have provided one free RPC account that has limits, if people abuse this you will need to
edit in your own RPC. All errors will be related to RPC. (Helius only free one that allows this bot)

Description: A Solana Whale Watcher program that collects and scrapes data from chain, 
monitors movement on a token and shows a leaderboard that updates as the list propagates.
Build you're own database records for your holders, events, and airdrops. 

How to Install:
	npm install

How to Start:
	node sww

USE: The bot connects to Solana blockchain, requests current token data, and propagates lists for your 
	 needs.	Run the bot one time before list propogation (starter lists are included) each consecutive
	 run will build your dataset if needed.

	
FAQ:

What are all the .json files?
holders : holder list, delete prior to use to propogate new updated list.
holdersbalance : holder list sorted by highest balance, delete prior to use to propagate updated list.
recentchangelist : updated changes from the last run.
output : where holder list propgates during runtime, will not overwrite holders.json
output2 : balance check from new/old holders on chain. Not sorted, first come first serve from chain data.
output3 :( * Output3,4, and 5. These work in conjection to sort, merge, and propogate lists 
output4 :    depending what data you're trying to collect. Data from these files will change as bot runs.
output5 :    SAVA DATA AS NEEDED BETWEEN RUNS! * )

These are where you'll save/update your Master data depending on needs:
Holders_Master 
Holders_Balances_Master
MasterList

Why do some wallets show red rank while their token balance show green?
Tracking is based off your own Master Files, more runs equals more accurate tracking
for long periods of time. Current setup is designed for projects to airdrop and have events
where they can scrape the most recent data. Customization is availble case by case basis.

Why is some data fields missing from certain lists?
This is by design so people can pull the specific data they want. 
It also allows greater levels of customization deeping on specific needs.

Any other questions feel free to reach out!



