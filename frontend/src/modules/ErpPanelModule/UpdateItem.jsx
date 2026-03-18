import { useState, useEffect } from 'react';
import { Form, Divider } from 'antd';
import dayjs from 'dayjs';
import { Button, Tag } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';

import calculate from '@/utils/calculate';
import { generate as uniqueId } from 'shortid';
import { selectUpdatedItem } from '@/redux/erp/selectors';
import Loading from '@/components/Loading';

import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import { settingsAction } from '@/redux/settings/actions';
// import { StatusTag } from '@/components/Tag';

function SaveForm({ form, translate }) {
  const handelClick = () => {
    form.submit();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {translate('update')}
    </Button>
  );
}

export default function UpdateItem({ config, UpdateForm }) {
  const translate = useLanguage();
  let { entity } = config;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);
  const [form] = Form.useForm();

  const resetErp = {
    status: '',
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    subTotal: 0,
    taxTotal: 0,
    taxRate: 0,
    total: 0,
    credit: 0,
    number: 0,
    year: 0,
  };

  const [currentErp, setCurrentErp] = useState(current ?? resetErp);

  const { id } = useParams();

  const onSubmit = (fieldsValue) => {
    if (!fieldsValue) return;

    // Deep clone to avoid mutation
    const dataToUpdate = { ...fieldsValue };

    // Convert dates to ISO strings
    if (fieldsValue.date && dayjs.isDayjs(fieldsValue.date)) {
      dataToUpdate.date = fieldsValue.date.toISOString();
    }
    if (fieldsValue.expiredDate && dayjs.isDayjs(fieldsValue.expiredDate)) {
      dataToUpdate.expiredDate = fieldsValue.expiredDate.toISOString();
    }

    // Process items: calculate totals and clean data
    if (fieldsValue.items && Array.isArray(fieldsValue.items)) {
      dataToUpdate.items = fieldsValue.items.map((item) => {
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
    if (dataToUpdate.client && typeof dataToUpdate.client === 'object') {
      dataToUpdate.client = dataToUpdate.client._id || dataToUpdate.client.value || dataToUpdate.client;
    }

    // Ensure taxRate is a number
    if (dataToUpdate.taxRate) {
      dataToUpdate.taxRate = Number(dataToUpdate.taxRate);
    }

    console.log('Updating invoice with payload:', dataToUpdate);
    dispatch(erp.update({ entity, id, jsonData: dataToUpdate }));
  };
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'update' }));
      navigate(`/${entity.toLowerCase()}/read/${id}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (current) {
      setCurrentErp(current);
      let formData = { ...current };
      
      // Convert dates to dayjs objects
      if (formData.date) {
        formData.date = dayjs(formData.date);
      }
      if (formData.expiredDate) {
        formData.expiredDate = dayjs(formData.expiredDate);
      }
      
      // Ensure taxRate exists
      if (!formData.taxRate) {
        formData.taxRate = 0;
      }

      form.resetFields();
      form.setFieldsValue(formData);
    }
  }, [current]);

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={translate('update')}
        ghost={false}
        tags={[
          <span key="status">{currentErp.status && translate(currentErp.status)}</span>,
          currentErp.paymentStatus && (
            <span key="paymentStatus">
              {currentErp.paymentStatus && translate(currentErp.paymentStatus)}
            </span>
          ),
        ]}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Cancel')}
          </Button>,
          <SaveForm translate={translate} form={form} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <UpdateForm current={current} />
        </Form>
      </Loading>
    </>
  );
}
