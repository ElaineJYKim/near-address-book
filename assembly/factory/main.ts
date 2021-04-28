import { AccountId, XCC_GAS, MIN_ACCOUNT_BALANCE } from './types';
import { } from './model';
import { ContractPromise, base58, ContractPromiseBatch, logging, context, env, u128 } from 'near-sdk-as';

const CODE = includeBytes("../../../build/release/addressBook.wasm")

@nearBindgen
export class Factory {

  private owner: AccountId;

  constructor(owner: AccountId) {
    this.owner = owner;
  };

  @mutateState()
  create_address_book(): void {
    const caller = context.sender;
    const addressBookId = this.full_account_for(caller);

    assert(
      u128.ge(context.attachedDeposit, MIN_ACCOUNT_BALANCE),
      "Minimum account balance must be attached to initialize a meme (3 NEAR)"
    );

    assert(env.isValidAccountID(addressBookId), "Address book Id is not a valid NEAR account name")
    assert(!this.has_address_book(addressBookId), "Meme name already exists")
  
    logging.log("attempting to create a new Address Book")


    let promise = ContractPromiseBatch.create(addressBookId)
    .create_account()
    .deploy_contract(Uint8Array.wrap(changetype<ArrayBuffer>(CODE)))
    .add_full_access_key(base58.decode(context.senderPublicKey))

    // "init" refers to constructor functions
    promise.function_call(
      "init", 
      null,
      context.attachedDeposit,
      XCC_GAS
    )

    promise.then(context.contractName).function_call(
      "on_address_book_created",
      null,
      u128.Zero,
      XCC_GAS
    )
  
  }

  on_address_book_created(): void {
    let results = ContractPromise.getResults();
    let addressBookCreated = results[0];
  
    // Verifying the remote contract call succeeded.
    // https://nomicon.io/RuntimeSpec/Components/BindingsSpec/PromisesAPI.html?highlight=promise#returns-3
    switch (addressBookCreated.status) {
      case 0:
        // promise result is not complete
        logging.log("Address Book creation is Pending")
        break;
      case 1:
        // promise result is complete and successful
        logging.log("Address Book creation succeeded")
        break;
      case 2:
        // promise result is complete and failed
        logging.log("Address Book creation failed")
        break;
  
      default:
        logging.log("Unexpected value for promise result [" + addressBookCreated.status.toString() + "]");
        break;
    }
  }

  has_address_book(id: AccountId): bool { 
    return false
  }
  
  private full_account_for(id: AccountId): AccountId {
    return id + "." + context.contractName
  }

}