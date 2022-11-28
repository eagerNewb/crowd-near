# Crowd
## _Blockchain crowdfunding made simple_

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Crowd is a crowd funding dApp built on near protocol!
_a simple prototype_

- Create your campaign!
- Blockchain security by default!
- ✨ Crowd Funding  re-invented! ✨
- ## Features

- Create your campaign and receive contributions immediately!
- Accepts _NEAR_ as contribution currency!
- Your campaign - _your RULES_!
- ONE campaign per account! 

## Tech

Crowd uses a number of open source projects to work properly:

- [NEAR protocol] - Layer 1 blockchain solution living on top of ethereum.
- [near-sdk-as] - web assembly translation for near contracts.
- [Learn-NEAR] - https://github.com/Learn-NEAR/starter--near-sdk-as

## Installation

Install the dependencies and devDependencies and start the server.

```sh
cd crowd-near
yarn
```

Crowd Functions

_In the example below we call the contract.name.initCampaign()_ 
_function from the account example.testnet_

near call `dev-contract` initCampaign '{args}' --accountId `example.testnet`

Change the `dev-contract` to the name you receive when deploying the contract.
The accountId you wish to create the campaign for. You should OWN this account, otherwise you can't control your Campaign and you want to be able to receive the funds from it.

## CREATORS

EXAMPLE ``` initCampaign ``` - create a camapaign
```sh
near call dev-1643474469513-99630285886186 initCampaign '{"goal": "3","description":"My first Campaign on NEAR!", "name":"FUND ME", "lifetime":"30"}' --accountId example.testnet
```

EXAMPLE ``` initCampaign ``` _edit/overwrite campaign_ - can be done only if no contributions have been made OR if campaign payed is _true_.
```sh
near call dev-1643474469513-99630285886186 initCampaign '{"goal": "25","description":"My first edited Campaign on NEAR!", "name":"FUND ME 2", "lifetime":"15"}' --accountId example.testnet
```

EXAMPLE ``` closeCampaign ```- close YOUR campaign
In order to close a campaign you should be it's creator!
Close will payout the funds to the campaign creator if campaign status is SUCCESS 
OR 
it will return the campaign funds to it's contributers if campaign status is FAIL

```sh
near call dev-1643474469513-99630285886186 closeCampaign '{"cid":"example.testnet"}' --accountId example.testnet
```

##
##
## CONTRIBUTORS

EXAMPLE ``` getCampaigns ```- list of campaigns

```sh
near call dev-1643474469513-99630285886186 getCampaigns --accountId example.testnet
```

``` backCampaign ``` - Contribute to a campaign.

```sh
 near call dev-1643474469513-99630285886186 backCampaign '{"cid": "example.testnet"}' --accountId mytest.testnet --deposit 1
```

##
##
## What's left?
- payout calculation, currently contributions above the goal, stay in the contract.
- sh scripts
- lifetime for campaigns
- payout logic in case campaign fails
- more detailed fields for the Campaign
- Front end

##
##
## License

MIT

**Free Software, Hell Yeah!**

