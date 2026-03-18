import { useProfileContext } from '@/context/profileContext';
import { generate as uniqueId } from 'shortid';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Typography } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileAdminForm from './ProfileAdminForm';

import { updateProfile } from '@/redux/auth/actions';

import { selectCurrentAdmin, selectAuth } from '@/redux/auth/selectors';
import { selectAppSettings } from '@/redux/settings/selectors';

import useLanguage from '@/locale/useLanguage';

const UpdateAdmin = ({ config }) => {
  const translate = useLanguage();

  const { profileContextAction } = useProfileContext();
  const { updatePanel } = profileContextAction;
  const dispatch = useDispatch();
  const { ENTITY_NAME } = config;

  const currentAdmin = useSelector(selectCurrentAdmin);
  const appSettings = useSelector(selectAppSettings);
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isSuccess) {
      updatePanel.close();
    }
  }, [isSuccess]);

  useEffect(() => {
    form.setFieldsValue({
      ...currentAdmin,
      bizcollab_app_date_format: appSettings?.bizcollab_app_date_format,
    });
  }, [currentAdmin, appSettings]);

  const handleSubmit = () => {
    form.submit();
  };

  const onSubmit = (fieldsValue) => {
    if (fieldsValue.file) {
      fieldsValue.file = fieldsValue.file[0].originFileObj;
    }

    dispatch(updateProfile({ entity: 'admin/profile', jsonData: fieldsValue }));
  };

  return (
    <Row gutter={[24, 24]}>
      <Col span={24} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography.Title level={4}>{translate('Edit Profile Settings')}</Typography.Title>
          <Typography.Text type="secondary">
            {translate('Save your personal details')}
          </Typography.Text>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            onClick={() => updatePanel.close()}
            key={`${uniqueId()}`}
            icon={<CloseCircleOutlined />}
          >
            {translate('Close')}
          </Button>
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              handleSubmit();
            }}
            type="primary"
            icon={<SaveOutlined />}
            htmlType="submit"
            loading={isLoading}
          >
            {translate('Save')}
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
          <Form
            form={form}
            onFinish={onSubmit}
            labelAlign="left"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 10 }}
          >
            <ProfileAdminForm isUpdateForm={true} />
          </Form>
      </Col>
    </Row>
  );
};

export default UpdateAdmin;
