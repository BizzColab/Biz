import React from 'react';
import { Form, Input, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

const { Text } = Typography;

export default function LoginForm() {
  const translate = useLanguage();
  return (
    <div>
      <Form.Item
        label={
          <Text strong style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {translate('email')}
          </Text>
        }
        name="email"
        rules={[
          {
            required: true,
            message: 'Please enter your email address',
          },
          {
            type: 'email',
            message: 'Please enter a valid email address',
          },
        ]}
      >
        <Input
          placeholder="Email"
          type="email"
          size="large"
          className="auth-input auth-input-focus"
          style={{
            height: 52,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            color: '#FFFFFF',
            paddingLeft: 16
          }}
        />
      </Form.Item>
      <Form.Item
        label={
          <Text strong style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {translate('password')}
          </Text>
        }
        name="password"
        rules={[
          {
            required: true,
            message: 'Please enter your password',
          },
        ]}
      >
        <Input.Password
          placeholder="Password"
          size="large"
          className="auth-input auth-input-focus"
          style={{
            height: 52,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            color: '#FFFFFF',
            paddingLeft: 16
          }}
        />
      </Form.Item>


      <Form.Item style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ fontSize: 14 }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>{translate('Remember me')}</Text>
            </Checkbox>
          </Form.Item>
          <a 
            className="login-form-forgot" 
            href="/forgetpassword" 
            style={{ 
              color: '#3B82F6',
              fontWeight: 600,
              fontSize: 14,
              transition: 'all 0.3s ease'
            }}
          >
            {translate('Forgot password?')}
          </a>
        </div>
      </Form.Item>
    </div>
  );
}
