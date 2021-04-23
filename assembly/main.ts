import { PostedMessage, messages } from './model';
import { 
  ContactIds, 
  Contact,
  contacts,
  contactsByOwner 
} from './model';
import { AccountId, Name, ContactKey } from './types'
import { Context, logging } from "near-sdk-as";

/************/
/* Changers */
/************/
export function addContact(name: Name, contactId: AccountId): void {
  
  //assert(!_contact_exists(contactId), "This contact already exists.");
  if (_contact_exists(contactId)) {
    return;
  }
  
  const key = _contact_key(contactId);
  const sender = Context.sender;
  const newContact = new Contact(name, contactId);
  
  // add to contacts
  contacts.set(key, newContact);

  // add to owner list
  let contactsIdList = getContactKeys();
  contactsIdList.push(key);
  const contactIds = new ContactIds(contactsIdList);
  contactsByOwner.set(sender, contactIds);

}

export function deleteContact(contactId: AccountId): void {
  
  assert(_contact_exists(contactId), "This contact doesn't exist.");

  const key = _contact_key(contactId);

  contacts.delete(key);

  let contactsIdList = getContactKeys();
  let newContactsIdList = new Array<string>();
  for (let i = 0; i < contactsIdList.length; i++) {
    if (contactsIdList[i] != key) {
      newContactsIdList.push(contactsIdList[i]);
    }
  }
  const contactIds = new ContactIds(newContactsIdList);
  contactsByOwner.set(Context.sender, contactIds);
}

/************/
/* Getters  */
/************/

// Returns array of contact keys used to access contacts.
export function getContactKeys(): Array<ContactKey> {
 
  const owner = Context.sender;
  let contactsIdList = contactsByOwner.get(owner);
  if (!contactsIdList) {
    return new Array<ContactKey>();
  }
  return contactsIdList.ids;

}

// Return array of Contacts for current user
export function getContacts(accountId: AccountId): Array<Contact> {
  
  //const owner = _extract_id(accountId);
  const owner = accountId;
  
  let keys = new Array<ContactKey>();
  const contactsIdList = contactsByOwner.get(owner);
  if (contactsIdList) {
    keys = contactsIdList.ids;
  }
  
  const len = keys.length;
  let contactsList = new Array<Contact>();

  for (let i = 0; i < len; i++) {
    contactsList.push(contacts.getSome(keys[i]));
  }

  return contactsList;
}
/************/
/* Internal */
/************/

// Key for contactsByOwner and contacts == sender+contactId
function _contact_key(contactId: AccountId): ContactKey {
  return Context.sender.concat(contactId);
}

function _contact_exists(contactId: AccountId): bool {
  const key = _contact_key(contactId)
  if (contacts.contains(key) &&
      contactsByOwner.getSome(Context.sender).ids.includes(key)){
    return true;
  }   
  return false;
}

function _extract_id(accountId: AccountId): string {
  let id = accountId;
  const lastPeriod = id.lastIndexOf('.');
  id = id.slice(0, lastPeriod)
  return id
}

// ------ OLD STARTING HERE

// The maximum number of latest messages the contract returns.
const MESSAGE_LIMIT = 10;

/**
 * Adds a new message under the name of the sender's account id.\
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
 */
export function addMessage(text: string): void {
  // Creating a new message and populating fields with our data
  const message = new PostedMessage(text);
  // Adding the message to end of the the persistent collection
  messages.push(message);
}

/**
 * Returns an array of last N messages.\
 * NOTE: This is a view method. Which means it should NOT modify the state.
 */
export function getMessages(): PostedMessage[] {
  const numMessages = min(MESSAGE_LIMIT, messages.length);
  const startIndex = messages.length - numMessages;
  const result = new Array<PostedMessage>(numMessages);
  for(let i = 0; i < numMessages; i++) {
    result[i] = messages[i + startIndex];
  }
  return result;
}



