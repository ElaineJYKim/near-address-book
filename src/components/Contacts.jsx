import React from 'react';
import PropTypes from 'prop-types';

export default function Contacts({ contacts }) {
  return (
    <>
      <h2>Contacts</h2>
      {contacts.map((contact, i) =>
        <p key={i}>
          <strong>{contact.name}</strong>: {contact.contactId}
        </p>
      )}
    </>
  );
}

Contacts.propTypes = {
  contacts: PropTypes.array
};
