import { storage } from "near-sdk-core"
import { u128, logging, PersistentSet, Context, ContractPromiseBatch } from 'near-sdk-as';

import { AccountId, ONE_NEAR, MIN_ACCOUNT_BALANCE, asNEAR } from '../../utils';
import { Campaign } from './models';

export const ownerIds = new PersistentSet<AccountId>("ci");

/* 
  RULES:
  1 Campaign per account.
  Campaign can be overwritten (edit) if it's unlocked.
  Campaign locks on first contributrion from backer.
  Campaign un-locks once its state is SUCCESS or FAIL.
  Once campaign goal is reached, the owner can call closeCampaign.
 */

/*
  initCampaign()
  Args
  - goal: 1500 (N)
  - description: Help us create the new portable flamethrower!
  - name: Portable flamethrower
  - lifetime: timestamp integer
*/
export function initCampaign(goal: u128, description: String, name: String, lifetime: u128): AccountId {  
  const c = createOrEdit(goal, description, name, u128.from(lifetime));
  return c.creator;
  
}

/*
  backCampaign()
  Args
  - cid: The campaign you want to back.
*/
export function backCampaign(cid: AccountId): void {
  const c = getCampaign(cid);
  c.back();
  storage.set(c.creator, c);
}

/*
  Closes a campaign.
  Pays out funds to c.creator if SUCCESS
  Returns contributions to c.backers if FAIL
*/
export function closeCampaign(): void {
  const c = getCampaign(Context.sender);

  assert(Context.sender == c.creator, "This method can be called only by the Campaign creator!")
  c.close();
  storage.set(c.creator, c);
  
} 

/*
  Logs campaigns.
*/
export function getCampaigns(): void {
  const ids = ownerIds.values();
  for (let i = 0; i < ids.length; i++) {
    logging.log(getCampaign(ids[i]));
  }
}

/*
  Decides wether to return campaign in storage || overwrite with new campaign 
  Based on locked and payed campaign params.
*/
function createOrEdit(goal: u128, description: String, name: String, lifetime: u128): Campaign {
  if (storage.hasKey(Context.sender)) {
    let c: Campaign = getCampaign(Context.sender);
    assert(!c.isLocked(), "Campaign is Locked!");
    if(!c.isPayed()) {
      return c;
    }
  } 
  
  let c = new Campaign(goal, description, name, lifetime);
  
  if(!ownerIds.has(c.creator)) {
    ownerIds.add(c.creator);
  }
  storage.set(Context.sender, c);

  return c;
}

/*
  Returns a campaign based on its id.
*/
export function getCampaign(cid: AccountId): Campaign {
  return storage.getSome<Campaign>(cid);
}

/*
  Gather scattered testing funds.
  Place your accountId in ContractPromiseBatch.create();
*/
export function returnBalance(): u128 {
  assert(getCampaign(Context.sender), "You can not withdraw funds. No campaigns in your name!");
  const payout = u128.sub(u128.from(Context.accountBalance), u128.mul(u128.from(3),ONE_NEAR));

  // E.g ContractPromiseBatch.create("test.testnet");
  ContractPromiseBatch.create(Context.sender).transfer(payout);

  return payout;
}
