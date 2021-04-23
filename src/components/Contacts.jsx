import React from 'react';
import PropTypes from 'prop-types';
import { SmileTwoTone, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import { List, Button } from 'antd';

export default function Contacts({ contacts, onDelete }) {
  return (

    <List
    itemLayout="horizontal"
    dataSource={contacts}
    renderItem={contact => (
      <List.Item
        actions={[
          <DeleteOutlined  style={{ color: "#FF585D" }} onClick={() => onDelete(contact.contactId)} />,
          <CopyOutlined style={{ color: "#00C08B" }} onClick={() => {navigator.clipboard.writeText(contact.contactId)}} />
        ]}
      >
        <List.Item.Meta
          avatar={<SmileTwoTone twoToneColor="#0072CE" />}
          title={contact.name}
          description={contact.contactId}
        />
      </List.Item>
    )}
  />
  );
}

Contacts.propTypes = {
  contacts: PropTypes.array
};
