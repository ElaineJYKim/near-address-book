import { Context, PersistentMap } from "near-sdk-as";
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