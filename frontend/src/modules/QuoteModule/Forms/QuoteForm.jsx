import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { 
  Form, 
  Input, 
  InputNumber, 
  Button, 
  Select, 
  Divider, 
  Row, 
  Col,
  Card,
  Space,
  Typography
} from 'antd';

import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import MoneyInputFormItem from '@/components/MoneyInputFormItem';
import { selectFinanceSettings } from '@/redux/settings/selectors';
import { useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';
import SelectAsync from '@/components/SelectAsync';

const { Text } = Typography;
const { TextArea } = Input;

export default function QuoteForm({ subTotal = 0, current = null }) {
  const financeSettings = useSelector(selectFinanceSettings);
  const last_quote_number = financeSettings?.last_quote_number ?? 0;

  return <LoadQuoteForm subTotal={subTotal} current={current} lastQuoteNumber={last_quote_number} />;
}

function LoadQuoteForm({ subTotal = 0, current = null, lastQuoteNumber = 0 }) {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const [lastNumber, setLastNumber] = useState(() => lastQuoteNumber + 1);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [taxRate, setTaxRate] = useState(0);
  const [totals, setTotals] = useState({ subTotal: 0, taxTotal: 0, total: 0 });
  const addField = useRef(false);
  const currentItems = useRef([]);

  const handleTaxChange = (value) => {
    const numeric = Number(value) || 0;
    const rate = numeric >= 1 ? numeric / 100 : numeric;
    setTaxRate(rate);
  };

  const calculateTotals = (items, currentTaxRate = taxRate) => {
    let subTotal = 0;
    
    if (items && Array.isArray(items)) {
      items.forEach((item) => {
        if (item && item.quantity && item.price) {
          const quantity = Number(item.quantity) || 0;
          const price = Number(item.price) || 0;
          subTotal += quantity * price;
        }
      });
    }

    const taxTotal = subTotal * currentTaxRate;
    const total = subTotal + taxTotal;

    setTotals({ subTotal, taxTotal, total });
  };

  useEffect(() => {
    if (current) {
      const { taxRate: currentTaxRate = 0, year, number, items = [] } = current;
      const rate = currentTaxRate >= 1 ? currentTaxRate / 100 : currentTaxRate;
      setTaxRate(rate);
      setCurrentYear(year);
      setLastNumber(number);
      currentItems.current = items;
      calculateTotals(items, rate);
    }
  }, [current]);

  useEffect(() => {
    if (currentItems.current.length > 0) {
      calculateTotals(currentItems.current, taxRate);
    }
  }, [taxRate]);

  useEffect(() => {
    if (addField.current) {
      addField.current.click();
    }
  }, []);

  return (
    <>
      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => {
        const itemsChanged = prevValues.items !== currentValues.items;
        const taxChanged = prevValues.taxRate !== currentValues.taxRate;
        
        if (currentValues.items) {
          currentItems.current = currentValues.items;
        }
        
        if (taxChanged && currentValues.taxRate !== undefined) {
          const newTaxValue = Number(currentValues.taxRate) || 0;
          const rate = newTaxValue >= 1 ? newTaxValue / 100 : newTaxValue;
          if (rate !== taxRate) {
            setTimeout(() => setTaxRate(rate), 0);
          }
        }
        
        if (itemsChanged) {
          const items = currentValues.items || [];
          setTimeout(() => calculateTotals(items, taxRate), 0);
        }
        return itemsChanged || taxChanged;
      }}>
        {() => null}
      </Form.Item>

      {/* Client & Quote Information */}
      <Card 
        title={<Text strong style={{ fontSize: 16, color: '#FFFFFF' }}>{translate('Quote Information')}</Text>}
        style={{ 
          marginBottom: 24, 
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          backdropFilter: 'blur(10px)'
        }}
        variant="borderless"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item
              name="client"
              label={translate('Client')}
              rules={[{ required: true, message: translate('Please select a client') }]}
            >
              <AutoCompleteAsync
                entity={'client'}
                displayLabels={['name']}
                searchFields={'name'}
                redirectLabel={'Add New Client'}
                withRedirect
                urlToRedirect={'/customer'}
                placeholder={translate('Select or search client')}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={4}>
            <Form.Item
              label={translate('Quote Number')}
              name="number"
              initialValue={lastNumber}
              rules={[{ required: true, message: translate('Required') }]}
            >
              <InputNumber 
                min={1} 
                style={{ width: '100%' }}
                placeholder="1"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={4}>
            <Form.Item
              label={translate('Year')}
              name="year"
              initialValue={currentYear}
              rules={[{ required: true, message: translate('Required') }]}
            >
              <InputNumber 
                style={{ width: '100%' }}
                placeholder="2024"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label={translate('Status')}
              name="status"
              initialValue={'draft'}
            >
              <Select
                options={[
                  { value: 'draft', label: translate('Draft') },
                  { value: 'pending', label: translate('Pending') },
                  { value: 'sent', label: translate('Sent') },
                  { value: 'accepted', label: translate('Accepted') },
                  { value: 'declined', label: translate('Declined') },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              name="date"
              label={translate('Quote Date')}
              rules={[{ required: true, type: 'object', message: translate('Required') }]}
              initialValue={dayjs()}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format={dateFormat}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              name="expiredDate"
              label={translate('Expiry Date')}
              rules={[{ required: true, type: 'object', message: translate('Required') }]}
              initialValue={dayjs().add(30, 'days')}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format={dateFormat}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={16} lg={12}>
            <Form.Item label={translate('Notes')} name="notes">
              <TextArea 
                rows={1}
                placeholder={translate('Add any additional notes or comments')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Line Items */}
      <Card 
        title={<Text strong style={{ fontSize: 16, color: '#FFFFFF' }}>{translate('Line Items')}</Text>}
        style={{ 
          marginBottom: 24, 
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          backdropFilter: 'blur(10px)'
        }}
        variant="borderless"
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[12, 0]} style={{ fontWeight: 600, color: '#FFFFFF' }}>
            <Col xs={0} sm={0} md={6} lg={6}>
              <Text style={{ color: '#FFFFFF' }}>{translate('Item')}</Text>
            </Col>
            <Col xs={0} sm={0} md={8} lg={8}>
              <Text style={{ color: '#FFFFFF' }}>{translate('Description')}</Text>
            </Col>
            <Col xs={0} sm={0} md={3} lg={3}>
              <Text style={{ color: '#FFFFFF' }}>{translate('Qty')}</Text>
            </Col>
            <Col xs={0} sm={0} md={4} lg={4}>
              <Text style={{ color: '#FFFFFF' }}>{translate('Price')}</Text>
            </Col>
            <Col xs={0} sm={0} md={3} lg={3}>
              <Text style={{ color: '#FFFFFF' }}>{translate('Total')}</Text>
            </Col>
          </Row>
        </div>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Card 
                  key={field.key}
                  size="small"
                  style={{ 
                    marginBottom: 12,
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <Form.Item noStyle shouldUpdate={(prev, curr) => {
                    const prevItem = prev.items?.[field.name];
                    const currItem = curr.items?.[field.name];
                    return prevItem?.quantity !== currItem?.quantity || 
                           prevItem?.price !== currItem?.price;
                  }}>
                    {({ getFieldValue }) => {
                      const items = getFieldValue('items') || [];
                      const item = items[field.name] || {};
                      const quantity = Number(item.quantity) || 0;
                      const price = Number(item.price) || 0;
                      const total = quantity * price;

                      return (
                        <Row gutter={[12, 12]} align="middle">
                          <Col xs={24} sm={24} md={6} lg={6}>
                            <Form.Item
                              key={field.key}
                              {...field}
                              name={[field.name, 'itemName']}
                              fieldKey={[field.fieldKey, 'itemName']}
                              rules={[{ required: true, message: translate('Required') }]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input placeholder={translate('Item name')} />
                            </Form.Item>
                          </Col>

                          <Col xs={24} sm={24} md={8} lg={8}>
                            <Form.Item
                              key={field.key}
                              {...field}
                              name={[field.name, 'description']}
                              fieldKey={[field.fieldKey, 'description']}
                              style={{ marginBottom: 0 }}
                            >
                              <Input placeholder={translate('Description')} />
                            </Form.Item>
                          </Col>

                          <Col xs={8} sm={6} md={3} lg={3}>
                            <Form.Item
                              key={field.key}
                              {...field}
                              name={[field.name, 'quantity']}
                              fieldKey={[field.fieldKey, 'quantity']}
                              rules={[{ required: true, message: translate('Required') }]}
                              style={{ marginBottom: 0 }}
                            >
                              <InputNumber
                                min={0}
                                placeholder="0"
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Col>

                          <Col xs={8} sm={8} md={4} lg={4}>
                            <Form.Item
                              key={field.key}
                              {...field}
                              name={[field.name, 'price']}
                              fieldKey={[field.fieldKey, 'price']}
                              rules={[{ required: true, message: translate('Required') }]}
                              style={{ marginBottom: 0 }}
                            >
                              <InputNumber
                                min={0}
                                placeholder="0.00"
                                style={{ width: '100%' }}
                                precision={2}
                              />
                            </Form.Item>
                          </Col>

                          <Col xs={6} sm={7} md={2} lg={2}>
                            <div style={{ 
                              padding: '4px 11px',
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '6px',
                              textAlign: 'center',
                              fontWeight: 500,
                              color: '#FFFFFF'
                            }}>
                              {total.toFixed(2)}
                            </div>
                          </Col>

                          <Col xs={2} sm={3} md={1} lg={1}>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(field.name)}
                              style={{ width: '100%' }}
                            />
                          </Col>
                        </Row>
                      );
                    }}
                  </Form.Item>
                </Card>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  ref={addField}
                  style={{ height: 45 }}
                >
                  {translate('Add Item')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      {/* Totals Section */}
      <Card variant="borderless" style={{ background: 'transparent' }}>
        <Row justify="end">
          <Col xs={24} sm={20} md={12} lg={10}>
            <Space orientation="vertical" style={{ width: '100%' }} size="middle">
              {/* Subtotal */}
              <Row justify="space-between" align="middle">
                <Col span={12}>
                  <Text strong style={{ fontSize: 15, color: '#FFFFFF' }}>{translate('Subtotal')}:</Text>
                </Col>
                <Col span={12}>
                  <MoneyInputFormItem readOnly value={totals.subTotal} />
                </Col>
              </Row>

              {/* Tax */}
              <Row justify="space-between" align="middle" gutter={[8, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="taxRate"
                    rules={[{ required: true, message: translate('Please select tax') }]}
                    style={{ marginBottom: 0 }}
                  >
                    <SelectAsync
                      value={taxRate}
                      onChange={handleTaxChange}
                      entity={'taxes'}
                      outputValue={'taxValue'}
                      displayLabels={['taxName']}
                      withRedirect={true}
                      urlToRedirect="/taxes"
                      redirectLabel={translate('Add New Tax')}
                      placeholder={translate('Select Tax')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <MoneyInputFormItem readOnly value={totals.taxTotal} />
                </Col>
              </Row>

              <Divider style={{ margin: '8px 0' }} />

              {/* Total */}
              <Row justify="space-between" align="middle">
                <Col span={12}>
                  <Text strong style={{ fontSize: 18, color: '#3B82F6' }}>
                    {translate('Total')}:
                  </Text>
                </Col>
                <Col span={12}>
                  <div style={{ 
                    fontSize: 20, 
                    fontWeight: 600, 
                    color: '#3B82F6',
                    textAlign: 'right'
                  }}>
                    <MoneyInputFormItem readOnly value={totals.total} />
                  </div>
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>
      </Card>
    </>
  );
}
