import React from 'react';
import PropTypes from 'prop-types';

export default function Contacts({ contacts }) {
  return (
    <>
      <h2>Contacts</h2>
      {contacts.map((contact, i) =>
        <p>
          <strong>{contact.name}</strong>:<br/>
          {contact.accountId}
        </p>
      )}
    </>
  );
}

Contacts.propTypes = {
  contacts: PropTypes.array
};
