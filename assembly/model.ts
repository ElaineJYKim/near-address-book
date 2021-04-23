import { Context, u128, PersistentVector, PersistentMap } from "near-sdk-as";
import { AccountId, Name, ContactKey } from './types'

@nearBindgen
export class ContactIds {
  constructor(public ids: Array<ContactKey>) {}
}

@nearBindgen
export class Contact {
  owner: AccountId;
  
  constructor (
    public name: Name,
    public contactId: AccountId
  ) {
    this.owner = Context.sender;
  }

}

// keys = concat(owner, contactId)
export const contactsByOwner = new PersistentMap<ContactKey, ContactIds>(
  "contactsByOwner"
);
export const contacts = new PersistentMap<ContactKey, Contact>(
  "contacts"
);

// ------ OLD STARTING HERE

/** 
 * Exporting a new class PostedMessage so it can be used outside of this file.
 */
@nearBindgen
export class PostedMessage {
  premium: boolean;
  sender: string;
  constructor(public text: string) {
    this.premium = Context.attachedDeposit >= u128.from('10000000000000000000000');
    this.sender = Context.sender;
  }
}
/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */
export const messages = new PersistentVector<PostedMessage>("m");
