import React, { useState } from 'react';
import { Form, Input, Select, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, BankOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

import useLanguage from '@/locale/useLanguage';
import { countryList } from '@/utils/countryList';
const { Text } = Typography;

export default function RegisterForm({ userLocation }) {
  const translate = useLanguage();

  const labelStyle = { 
    fontSize: 13, 
    color: 'rgba(255, 255, 255, 0.45)', 
    textTransform: 'uppercase', 
    letterSpacing: '1px',
    fontWeight: 600
  };

  const inputStyle = {
    height: 52,
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    color: '#FFFFFF'
  };

  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score += 25;
    if (pass.length > 8) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    setPasswordStrength(score);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return '#ef4444';
    if (passwordStrength <= 50) return '#f59e0b';
    if (passwordStrength <= 75) return '#3b82f6';
    return '#22d3ee'; // Cyber Cyan
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 25) return 'Vulnerable';
    if (passwordStrength <= 50) return 'Basic Security';
    if (passwordStrength <= 75) return 'Enterprise Grade';
    return 'Secure Infrastructure';
  };

  return (
    <>
      <Form.Item
        name="name"
        label={<Text style={labelStyle}>{translate('Full Name')}</Text>}
        rules={[
          {
            required: true,
            message: 'Please enter your full name',
          },
        ]}
      >
        <Input 
          size="large" 
          placeholder="John Doe"
          className="auth-input-focus"
          style={{ ...inputStyle, paddingLeft: 16 }}
        />
      </Form.Item>

      <Form.Item
        name="companyName"
        label={<Text style={labelStyle}>{translate('Company Name')}</Text>}
        rules={[
          {
            required: true,
            message: 'Please enter your company name',
          },
        ]}
      >
        <Input 
          size="large" 
          placeholder="Your Company Ltd."
          className="auth-input-focus"
          style={{ ...inputStyle, paddingLeft: 16 }}
        />
      </Form.Item>

      <Form.Item
        name="email"
        label={<Text style={labelStyle}>{translate('Email Address')}</Text>}
        rules={[
          {
            required: true,
            message: 'Please enter your email',
          },
          {
            type: 'email',
            message: 'Please enter a valid email',
          },
        ]}
      >
        <Input
          type="email"
          size="large"
          placeholder="Email"
          className="auth-input-focus"
          style={{ ...inputStyle, paddingLeft: 16 }}
        />
      </Form.Item>

      <Form.Item
        name="mobile"
        label={<Text style={labelStyle}>{translate('Mobile Number')}</Text>}
        rules={[
          {
            required: true,
            message: 'Please enter your mobile number',
          },
          {
            pattern: /^[0-9]{10}$/,
            message: 'Please enter a valid 10-digit mobile number',
          },
        ]}
      >
        <Input
          size="large"
          placeholder="9876543210"
          maxLength={10}
          className="auth-input-focus"
          style={{ ...inputStyle, paddingLeft: 16 }}
        />
      </Form.Item>

      <Form.Item
        name="gstNumber"
        label={<Text style={labelStyle}>{translate('GST Number (Optional)')}</Text>}
        rules={[
          {
            pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            message: 'Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)',
          },
        ]}
      >
        <Input
          size="large"
          placeholder="22AAAAA0000A1Z5"
          className="auth-input-focus"
          style={{ ...inputStyle, paddingLeft: 16 }}
        />
      </Form.Item>

      <Form.Item
        name="password"
        label={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Text style={labelStyle}>{translate('Password')}</Text>
            <Text style={{ fontSize: 11, color: getStrengthColor(), fontWeight: 700, textTransform: 'uppercase' }}>
              {getStrengthLabel()}
            </Text>
          </div>
        }
        rules={[
          {
            required: true,
            message: 'Please enter your password',
          },
          {
            min: 6,
            message: 'Password must be at least 6 characters',
          },
        ]}
      >
        <div>
          <Input.Password 
            size="large" 
            placeholder="Password"
            className="auth-input-focus"
            style={{ ...inputStyle, marginBottom: 8, paddingLeft: 16 }}
            onChange={(e) => calculateStrength(e.target.value)}
          />
          <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <motion.div 
              animate={{ width: `${passwordStrength}%`, background: getStrengthColor() }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ height: '100%' }}
            />
          </div>
        </div>
      </Form.Item>


      <Form.Item
        label={<Text style={labelStyle}>{translate('Country')}</Text>}
        name="country"
        rules={[
          {
            required: true,
            message: 'Please select your country',
          },
        ]}
        initialValue={userLocation || 'IN'}
      >
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          size="large"
          placeholder="Select your country"
          className="auth-select"
          style={{ ...inputStyle, background: 'rgba(255, 255, 255, 0.03)' }}
        >
          {countryList.map((country) => (
            <Select.Option
              key={country.value}
              value={country.value}
              label={translate(country.label)}
            >
              {country?.icon && country?.icon + ' '}
              {translate(country.label)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
}

