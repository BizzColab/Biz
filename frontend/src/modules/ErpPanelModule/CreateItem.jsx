import { useEffect } from 'react';
import { Button, Form } from 'antd';
import { SaveOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import useLanguage from '@/locale/useLanguage';
import { settingsAction } from '@/redux/settings/actions';
import { erp } from '@/redux/erp/actions';
import { selectCreatedItem } from '@/redux/erp/selectors';
import calculate from '@/utils/calculate';
import Loading from '@/components/Loading';
import { useMoney } from '@/settings';

export default function CreateItem({ config, CreateForm }) {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currency_code } = useMoney();

  useEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, [dispatch]);

  const { entity } = config;
  const { isLoading, isSuccess, result } = useSelector(selectCreatedItem);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'create' }));
      navigate(`/${entity.toLowerCase()}/read/${result._id}`);
    }
  }, [isSuccess, form, dispatch, entity, navigate, result]);

  const onSubmit = (fieldsValue) => {
    if (!fieldsValue) return;

    // Deep clone to avoid mutation
    const payload = { ...fieldsValue };

    // Convert dates to ISO strings
    if (payload.date && dayjs.isDayjs(payload.date)) {
      payload.date = payload.date.toISOString();
    }
    if (payload.expiredDate && dayjs.isDayjs(payload.expiredDate)) {
      payload.expiredDate = payload.expiredDate.toISOString();
    }

    // Process items: calculate totals and clean data
    if (payload.items && Array.isArray(payload.items)) {
      payload.items = payload.items.map((item) => {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const total = calculate.multiply(quantity, price);
        
        return {
          itemName: item.itemName || '',
          description: item.description || '',
          quantity,
          price,
          total
        };
      });
    }

    // Handle client - extract ID if object
    if (payload.client && typeof payload.client === 'object') {
      payload.client = payload.client._id || payload.client.value || payload.client;
    }

    // Ensure taxRate is a number
    if (payload.taxRate) {
      payload.taxRate = Number(payload.taxRate);
    }

    // Note: currency is added by backend based on settings, not sent from frontend

    console.log('Submitting invoice payload:', payload);
    dispatch(erp.create({ entity, jsonData: payload }));
  };

  return (
    <>
      {/* Action Bar */}
      <div style={{
        background: '#000000',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px 24px',
        marginBottom: 24,
        marginLeft: -24,
        marginRight: -24,
        marginTop: -24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>
          {translate(`Create ${entity}`)}
        </h2>
      </div>

      {/* Content */}
      <Loading isLoading={isLoading}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onSubmit}
        >
          <CreateForm current={null} />
          
          {/* Bottom Action Buttons */}
          <div style={{ 
            marginTop: 32, 
            paddingTop: 24, 
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12
          }}>
            <Button
              onClick={() => navigate(`/${entity.toLowerCase()}`)}
              icon={<CloseCircleOutlined />}
              size="large"
            >
              {translate('Cancel')}
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              icon={<SaveOutlined />}
              loading={isLoading}
              size="large"
            >
              {translate(`Save ${entity}`)}
            </Button>
          </div>
        </Form>
      </Loading>
    </>
  );
}
