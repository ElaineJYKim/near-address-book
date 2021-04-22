import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import Form from './components/Form';
import FormContacts from './components/FormContacts';
import SignIn from './components/SignIn';
import Messages from './components/Messages';
import Contacts from './components/Contacts';

const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // TODO: don't just fetch once; subscribe!
    contract.getMessages().then(setMessages);
    if (currentUser) {
      contract.getContacts(
        {accountId: currentUser.accountId}
      ).then(setContacts);
    }
  }, []);

  const onAddContact = (e) => {
    e.preventDefault();
    console.log("ADDING CONTACT")
    const { fieldset, name, contactId } = e.target.elements;
    fieldset.disabled = true;

    contract.addContact(
      {name: name.value, contactId: contactId.value}
    ).then(() => {
      contract.getContacts(
        {accountId: currentUser.accountId}
      ).then(contacts => {
        console.log(contacts)
        setContacts(contacts);
        name.value = '';
        contactId.value = '';
        fieldset.disabled = false;
        name.focus();
      });
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const { fieldset, message, donation } = e.target.elements;

    fieldset.disabled = true;

    // TODO: optimistically update page with new message,
    // update blockchain data in background
    // add uuid to each message, so we know which one is already known
    contract.addMessage(
      { text: message.value },
      BOATLOAD_OF_GAS,
      Big(donation.value || '0').times(10 ** 24).toFixed()
    ).then(() => {
      console.log("Loading new messages")
      contract.getMessages().then(messages => {
        setMessages(messages);
        message.value = '';
        donation.value = SUGGESTED_DONATION;
        fieldset.disabled = false;
        message.focus();
      });
    });
  };

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NEAR Guest Book'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header>
        <h1>NEAR Guest Book</h1>
        { currentUser
          ? <button onClick={signOut}>Log out</button>
          : <button onClick={signIn}>Log in</button>
        }
      </header>
      { currentUser
        ? <div>
            <Form onSubmit={onSubmit} currentUser={currentUser} />
            <FormContacts addContact={onAddContact} currentUser={currentUser}/>
          </div>
        : <SignIn/>
      }
      { !!currentUser && !!messages.length && 
        <div>
          <Contacts contacts={contacts}/>
          <Messages messages={messages}/>
        </div>
      }
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    addMessage: PropTypes.func.isRequired,
    getMessages: PropTypes.func.isRequired,
    addContact: PropTypes.func.isRequired,
    getContacts: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
