import { addMessage, getMessages, addContact, getContacts, getContactKeys, deleteContact } from '../main';
import { PostedMessage, messages, Contact, ContactIds, contacts, contactsByOwner } from '../model';
import { VMContext, Context, u128 } from 'near-sdk-as';

// function createMessage(text: string): PostedMessage {
//   return new PostedMessage(text);
// }

// const message = createMessage('hello world');

// describe('message tests', () => {
//   afterEach(() => {
//     while(messages.length > 0) {
//       messages.pop();
//     }
//   });

//   it('adds a message', () => {
//     addMessage('hello world');
//     expect(messages.length).toBe(
//       1,
//       'should only contain one message'
//     );
//     expect(messages[0]).toStrictEqual(
//       message,
//       'message should be "hello world"'
//     );
//   });

//   it('adds a premium message', () => {
//     VMContext.setAttached_deposit(u128.from('10000000000000000000000'));
//     addMessage('hello world');
//     const messageAR = getMessages();
//     expect(messageAR[0].premium).toStrictEqual(true,
//       'should be premium'
//     );
//   });

//   it('retrieves messages', () => {
//     addMessage('hello world');
//     const messagesArr = getMessages();
//     expect(messagesArr.length).toBe(
//       1,
//       'should be one message'
//     );
//     expect(messagesArr).toIncludeEqual(
//       message,
//       'messages should include:\n' + message.toJSON()
//     );
//   });

//   it('only show the last 10 messages', () => {
//     addMessage('hello world');
//     const newMessages: PostedMessage[] = [];
//     for(let i: i32 = 0; i < 10; i++) {
//       const text = 'message #' + i.toString();
//       newMessages.push(createMessage(text));
//       addMessage(text);
//     }
//     const messages = getMessages();
//     log(messages.slice(7, 10));
//     expect(messages).toStrictEqual(
//       newMessages,
//       'should be the last ten messages'
//     );
//     expect(messages).not.toIncludeEqual(
//       message,
//       'shouldn\'t contain the first element'
//     );
//   });
// });

describe('contacts tests', () => {

  // it ("trials", () => {
  //   let accountId = "elaine.kim.testnet"
  //   const lastPeriod = accountId.lastIndexOf(".");
  //   accountId = accountId.slice(0, lastPeriod)
  //   log(accountId);
  // });

  // it('adds a contact', () => {
  //   const senderId = Context.sender;
  //   const sender = senderId.concat(".testnet");

  //   addContact("bee", "bee.testnet");
  //   addContact("flower", "flower.testnet");
  //   log(contacts.get("bobbee.testnet"));
  //   log(contacts.get("bobflower.testnet"));
  //   log(getContactKeys());
  //   log(getContacts(sender));
  // });

  // it('deletes a contact', () => {

  //   addContact('sean', 'sean.testnet');
  //   addContact('bubs', 'bubs.testnet')
  //   log(getContacts());
  //   deleteContact('sean.testnet');
  //   log(getContacts());
  // });

  it ('gets all the contacts for cur owner', () => {
    log(getContacts(Context.sender));
    addContact('sean', 'sean.testnet');
    addContact('bub', 'bub.testnet');
    addContact('um', 'ummers.testnet');
    log(contactsByOwner.get(Context.sender));
    log(getContactKeys());
    log(Context.sender);
    log(getContacts(Context.sender));
  });

});

// describe('attached deposit tests', () => {
//   beforeEach(() => {
//     VMContext.setAttached_deposit(u128.fromString('0'));
//     VMContext.setAccount_balance(u128.fromString('0'));
//   });

//   it('attaches a deposit to a contract call', () => {
//     log('Initial account balance: ' + Context.accountBalance.toString());

//     addMessage('hello world');
//     VMContext.setAttached_deposit(u128.from('10'));

//     log('Attached deposit: 10');
//     log('Account balance after deposit: ' + Context.accountBalance.toString());

//     expect(Context.accountBalance.toString()).toStrictEqual(
//       '10',
//       'balance should be 10'
//     );
//   });
// });
