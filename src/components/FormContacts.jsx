import React from 'react';
import PropTypes from 'prop-types';

export default function FormContacts({ addContact, currentUser }) {
  return (
    <form onSubmit={addContact}>
      <fieldset id="fieldset">
        <p>Hey, { currentUser.accountId }! Add a new contact</p>
        <p className="highlight">
          <label htmlFor="name">Name:</label>
          <input
            autoComplete="off"
            autoFocus
            id="name"
            required
          />
        </p>
        <p className="highlight">
          <label htmlFor="accountId">Contact's Account Id:</label>
          <input
            autoComplete="off"
            autoFocus
            id="contactId"
            required
          />
        </p>
        <button type="submit">
          Sign
        </button>
      </fieldset>
    </form>
  );
}

FormContacts.propTypes = {
  addContact: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired
  })
};
