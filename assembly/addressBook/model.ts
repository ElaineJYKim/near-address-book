import {AccountId, tHandle, ADDRESS_BOOK_KEY} from './types';
import {} from './model';
import { context, PersistentSet, PersistentMap, storage } from 'near-sdk-as';

@nearBindgen
export class Address {
  constructor(
    public tHandle: tHandle,
    public accountId: AccountId
  ){}
}

@nearBindgen
export class AddressBook {
  owner: AccountId = context.predecessor;

  constructor(){}

  // BASIC FUNCTIONS
  static create(): void {
    const addressBook = new AddressBook();
    this.set(addressBook)
  }
  static get(): AddressBook {
    return storage.getSome<AddressBook>(ADDRESS_BOOK_KEY)
  }
  static set(addressBook: AddressBook): void {
    storage.set(ADDRESS_BOOK_KEY, addressBook)
  }

  // ADDRESSES
  static get_addresses(): Address[] { 
    let addressList = new Array<Address>();
    const keys = ids.values();

    for (let i = 0; i < keys.length; i++) {
      addressList.push(addresses.getSome(keys[i]))
    }

    return addressList
  }
  static add_address(tHandle:tHandle, id:AccountId): void {
    const address = new Address(tHandle, id);
    addresses.set(id, address);
  }
  static delete_address(id: AccountId): void {
    ids.delete(id);
    addresses.delete(id);
  }
  static contains(id: AccountId): bool {
    return ids.has(id)
  }
  
}

const ids = new PersistentSet<AccountId>("i");
const addresses = new PersistentMap<AccountId, Address>("a");
