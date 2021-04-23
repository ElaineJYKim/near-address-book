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
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // TODO: don't just fetch once; subscribe!
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

  const onDeleteContact = (contactId) => {
    console.log("DELETING CONTACT: ", contactId);

    contract.deleteContact(
      {contactId: contactId}
    ).then(() => {
      contract.getContacts(
        {accountId: currentUser.accountId}
      ).then(contacts => {
        console.log(contacts);
        setContacts(contacts);
      })
    })
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
            <FormContacts addContact={onAddContact} currentUser={currentUser}/>
          </div>
        : <SignIn/>
      }
      { !!currentUser && !!contacts.length && 
        <Contacts contacts={contacts} onDelete={onDeleteContact}/>
      }
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
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
