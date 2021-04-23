import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Typography} from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

export default function FormContacts({ addContact }) {
  return (

    <Form name="horizontal_login" layout="inline" onFinish={addContact}>
        <Form.Item name="name" rules={[{ required: true }]}>
          <Input
            autoComplete="off"
            autoFocus
            placeholder="Name"
            required
          />
        </Form.Item>
        <Form.Item name="contactId" rules={[{ required: true }]}>
          <Input
            autoComplete="off"
            autoFocus
            placeholder="Account ID"
            required
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<UserAddOutlined />} />
        </Form.Item>
    </Form>
  );
}

FormContacts.propTypes = {
  addContact: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired
  })
};
