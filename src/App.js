import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormContacts from './components/FormContacts';
import Contacts from './components/Contacts';

import { PageHeader, Button } from 'antd';
import { Card, Row, Col, Space, Divider, Typography } from 'antd';
const { Text } = Typography;


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

  const onAddContact = (values) => {
    console.log(values)
    console.log("ADDING CONTACT")
    const name = values.name;
    const contactId = values.contactId;

    contract.addContact(
      {name: name, contactId: contactId}
    ).then(() => {
      contract.getContacts(
        {accountId: currentUser.accountId}
        ).then(contacts => {
          console.log(contacts)
          setContacts(contacts);
          name = '';
          contactId = '';
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
      <Card style={{ "width": "500",  "boxShadow": "0 6px 12px 0 rgba(0,0,0,0.2)"}}>

        <PageHeader 
          title="Address Book" 
          subTitle="Powered by NEAR"
          extra={ currentUser
            ? <Button type="primary" onClick={signOut}>Log out</Button>
            : <Button type="primary" onClick={signIn}>Log in</Button>
          }
        />

        {!! currentUser &&
          <Row>

            <Space 
              direction="vertical" 
              split={
                <Divider><Text disabled>{currentUser.accountId}</Text></Divider>
              }
            >

            <FormContacts addContact={onAddContact}/>
            
            { !!contacts.length && 
              <Contacts contacts={contacts} onDelete={onDeleteContact}/>
            }
            </Space>
          </Row>
        }

      </Card>
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
