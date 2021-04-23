import React from 'react';
import PropTypes from 'prop-types';

export default function Contacts({ contacts, onDelete }) {
  return (
    <>
      <h2>Contacts</h2>
      {contacts.map((contact, i) =>
        <p key={i}>
          <strong>{contact.name}</strong>: {contact.contactId} 
          <button type="button" onClick={() => onDelete(contact.contactId)}>delete</button>
        </p>
      )}
    </>
  );
}

Contacts.propTypes = {
  contacts: PropTypes.array
};
