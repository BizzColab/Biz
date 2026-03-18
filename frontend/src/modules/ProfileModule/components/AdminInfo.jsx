import { useEffect, useState } from 'react';
import { useProfileContext } from '@/context/profileContext';
import { generate as uniqueId } from 'shortid';
import { EditOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Descriptions, Divider, Row, Typography } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { selectAppSettings } from '@/redux/settings/selectors';

import useLanguage from '@/locale/useLanguage';
import { FILE_BASE_URL } from '@/config/serverApiConfig';

const AdminInfo = ({ config }) => {
  const translate = useLanguage();
  const navigate = useNavigate();
  const { profileContextAction } = useProfileContext();
  const { modal, updatePanel } = profileContextAction;
  const { ENTITY_NAME } = config;
  const currentAdmin = useSelector(selectCurrentAdmin);
  const appSettings = useSelector(selectAppSettings);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography.Title level={4}>{translate('Profile Settings')}</Typography.Title>
          <Typography.Text type="secondary">
            {translate('Update your personal details and account security')}
          </Typography.Text>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              updatePanel.open();
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            {translate('Edit')}
          </Button>
          <Button
            key={`${uniqueId()}`}
            icon={<LockOutlined />}
            onClick={() => {
              modal.open();
            }}
          >
            {translate('Update Password')}
          </Button>
        </div>
      </Col>
      <Col
        xl={{ span: 18, offset: 2 }}
        lg={{ span: 24 }}
        md={{ span: 24 }}
        sm={{ span: 24 }}
        xs={{ span: 24 }}
      >
        <Row align="middle">
        <Col xs={{ span: 24 }} sm={{ span: 7 }} md={{ span: 5 }}>
          <Avatar
            className="last left"
            src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
            size={96}
            style={{
              color: '#f56a00',
              backgroundColor: currentAdmin?.photo ? 'none' : '#fde3cf',
              boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 15px 3px',
              fontSize: '48px',
            }}
            alt={`${currentAdmin?.name}`}
          >
            {currentAdmin?.name?.charAt(0).toUpperCase() || 'A'}
          </Avatar>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 18 }}>
          <Descriptions column={1} size="middle">
            <Descriptions.Item label={translate('Name')}>
              {currentAdmin?.name || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label={translate('Email')}>
              {currentAdmin?.email || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label={translate('Mobile')}>
              {currentAdmin?.mobile || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label={translate('Role')}>
              <span className="capitalize">{currentAdmin?.role || 'Owner'}</span>
            </Descriptions.Item>
            <Descriptions.Item label={translate('Date Format')}>
              {appSettings?.bizcollab_app_date_format || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        </Row>
        <Divider />
        <Button
          key={`${uniqueId()}`}
          icon={<LogoutOutlined />}
          className="right"
          onClick={() => navigate('/logout')}
        >
          {translate('Logout')}
        </Button>
      </Col>
    </Row>
  );
};
export default AdminInfo;
