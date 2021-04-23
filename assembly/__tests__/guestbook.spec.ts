import { addContact, getContacts, getContactKeys, deleteContact } from '../main';
import { Contact, ContactIds, contacts, contactsByOwner } from '../model';
import { VMContext, Context, u128 } from 'near-sdk-as';

describe('contacts tests', () => {

  it('adds a contact', () => {
    addContact('bean', 'bean.testnet');
    expect(getContacts(Context.sender).length).toStrictEqual(1);
    expect(contacts.get(Context.sender.concat('bean.testnet'))).toBeTruthy();
  });
  
  it ('gets all the contacts for cur owner', () => {
    addContact('sean', 'sean.testnet');
    addContact('bub', 'bub.testnet');
    addContact('um', 'ummers.testnet');
    expect(getContactKeys().length).toStrictEqual(3);
    expect(getContacts(Context.sender).length).toStrictEqual(3);
  });

  it('deletes a contact', () => {
    addContact('sean', 'sean.testnet');
    addContact('bubs', 'bubs.testnet');
    deleteContact('bubs.testnet');
    expect(getContacts(Context.sender).length).toStrictEqual(1);
    expect(contacts.get(Context.sender.concat('bubs.testnet'))).toBeFalsy();
  });

});
