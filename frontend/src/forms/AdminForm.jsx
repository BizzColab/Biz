import { Form, Input, Select, Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function AdminForm({ isUpdateForm = false, isForAdminOwner = false }) {
  const translate = useLanguage();
  return (
    <>
      <Form.Item
        label={translate('Name')}
        name="name"
        rules={[
          {
            required: true,
            message: 'Please enter name',
          },
        ]}
      >
        <Input autoComplete="off" placeholder="John Doe" />
      </Form.Item>

      <Form.Item
        label={translate('Email')}
        name="email"
        rules={[
          {
            required: true,
            message: 'Please enter email',
          },
          {
            type: 'email',
            message: 'Please enter a valid email',
          },
        ]}
      >
        <Input autoComplete="off" placeholder="email@example.com" disabled={isUpdateForm} />
      </Form.Item>

      {!isUpdateForm && (
        <Form.Item
          label={translate('Password')}
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter password',
            },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      )}

      <Form.Item
        label={translate('Mobile')}
        name="mobile"
        rules={[
          {
            required: true,
            message: 'Please enter mobile number',
          },
          {
            pattern: /^[0-9]{10}$/,
            message: 'Please enter a valid 10-digit mobile number',
          },
        ]}
      >
        <Input autoComplete="off" placeholder="9876543210" maxLength={10} />
      </Form.Item>

      <Form.Item
        label={translate('Company Name')}
        name="companyName"
        rules={[
          {
            required: true,
            message: 'Please enter company name',
          },
        ]}
      >
        <Input autoComplete="off" placeholder="ABC Pvt Ltd" />
      </Form.Item>

      <Form.Item
        label={translate('GST Number')}
        name="gstNumber"
        rules={[
          {
            pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            message: 'Please enter a valid GST number',
          },
        ]}
      >
        <Input autoComplete="off" placeholder="22AAAAA0000A1Z5 (Optional)" />
      </Form.Item>

      <Form.Item
        label={translate('Role')}
        name="role"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          <Select.Option value="owner" disabled={!isForAdminOwner}>
            {translate('Account owner')}
          </Select.Option>
          <Select.Option value="admin" disabled={isForAdminOwner}>
            {translate('super_admin')}
          </Select.Option>
          <Select.Option value="manager" disabled={isForAdminOwner}>
            {translate('manager')}
          </Select.Option>
          <Select.Option value="employee" disabled={isForAdminOwner}>
            {translate('employee')}
          </Select.Option>
          <Select.Option value="create_only" disabled={isForAdminOwner}>
            {translate('create_only')}
          </Select.Option>
          <Select.Option value="read_only" disabled={isForAdminOwner}>
            {translate('read_only')}
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={translate('enabled')}
        name="enabled"
        valuePropName={'checked'}
        initialValue={true}
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </>
  );
}
