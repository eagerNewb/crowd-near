import { u128,ContractPromiseBatch, Context, logging } from "near-sdk-as"
import { AccountId, ONE_NEAR, Timestamp } from '../../utils';

@nearBindgen
export class Backer {
    public id: AccountId;
    public contribution: u128;
    private reward: String;

    constructor() {
      this.id = Context.sender;
      this.contribution = Context.attachedDeposit;
      this.reward = "Reawrd";
    }
   
}

export enum States {
    ACTIVE,
    SUCCESS,
    FAIL,
};

@nearBindgen
export class Campaign {
      public creator: AccountId;
      private backers: Map<AccountId, Backer>;
      private goal: u128;
      private vault: u128;
      private payed: bool;
      private locked: bool;
      public state: States;
      private description: String;
      private name: String;
      private lifetime: u128;

      constructor(goal: u128, description: String, name: String, lifetime: u128) {
        this.creator = Context.sender;
        this.backers = new Map<AccountId, Backer>();
        this.goal = u128.mul(u128.from(goal),ONE_NEAR);
        this.payed = false;
        this.locked = false;
        this.state = States.ACTIVE;
        this.description = description;
        this.name =  name;       
        this.lifetime = lifetime; 
      }

      public back(): void {
        assert(this.state == States.ACTIVE, `Campaign has reached it's goal of ${this.vault} and is ${this.state}!`);

        let backer = new Backer();
        
        if(this.backers.has(backer.id)) {
           backer.contribution = u128.add(backer.contribution, this.backers.get(backer.id).contribution); 
        }
        this.vault = u128.add(this.vault, backer.contribution);
        this.backers.set(backer.id, backer);

        this.goalVsVault();

      }
      public isLocked(): bool {
          return this.locked;
      }

      public isPayed(): bool {
          return this.payed;
      }

      // closes campaign
      public close(): void {
        
        switch(this.state) {
            case States.SUCCESS: {

                const p = ContractPromiseBatch
                          .create(this.creator)
                          .transfer(this.vault);
                this.payed = true;
                this.locked = false;
                break;
            }
            case States.FAIL:{
                logging.log(`Campaign FAILED to meet its goal in ${this.lifetime}! Funds will be returned to backers.`);
                let b = this.backers.values();
                for (let i = 0; i < b.length; i++) {
                  this.vault = u128.sub(this.vault, b[i].contribution);
                  ContractPromiseBatch.create(b[i].id).transfer(b[i].contribution);
                }                
                this.payed = true;
                this.locked = false;

                break;
            }
            case States.ACTIVE:{
                logging.log("Campaign in progress . . ");
                let c = new Date(2020-12-20).getTime();
                logging.log(c)
                break;
            }
        }

       

      }
      

      private goalVsVault(): void {
        if((this.goal == this.vault) || this.vault > this.goal) {
          this.state = States.SUCCESS;
        } 
        //TODO: create lifetime
        if(this.goal > this.vault) {
          this.state = States.ACTIVE;
          this.locked = true;
        }
        
        if((u128.from(Context.blockTimestamp) > u128.from(this.lifetime)) && (this.goal > this.vault)) {
          logging.log(Context.blockTimestamp);
          logging.log(this.lifetime);
          this.state = States.FAIL;
        }
        
      }
}

