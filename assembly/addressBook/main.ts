import { AccountId, ADDRESS_BOOK_KEY, tHandle } from './types';
import {Address, AddressBook} from './model';
import {context, storage} from 'near-sdk-as';

export function init(): void {
  assert(!is_initialized(), "Contract is already initialized.");
  AddressBook.create()
}
export function get_address_book(): AddressBook {
  assert_contract_is_initialized()
  return AddressBook.get()
}

export function get_addresses(): Address[] {
  assert_contract_is_initialized()
  return AddressBook.get_addresses()
}
export function add_address(tHandle: tHandle, id: AccountId): void {
  assert_signed_by_creator()
  assert(AddressBook.contains(id), "This address is already in the Address Book.");
  AddressBook.add_address(tHandle, id);
}
export function delete_address(id: AccountId): void {
  assert_signed_by_creator() 
  assert(!AddressBook.contains(id), "This address doesn't exist.");
  AddressBook.delete_address(id)
}

/**
 * PRIVATE FUNCTION == NOT PART OF CONTRACT INTERFACE
 */
// CALLER IS OWNER
function is_owner(): bool {
  return context.predecessor == AddressBook.get().owner
}
function assert_signed_by_creator(): void {
  assert(is_owner(), "This method can only be called by the meme creator")
}

// INIT CHECKS
function is_initialized(): bool {
  return storage.hasKey(ADDRESS_BOOK_KEY);
}
function assert_contract_is_initialized(): void {
  assert(is_initialized(), "Contract must be initialized first.");
}