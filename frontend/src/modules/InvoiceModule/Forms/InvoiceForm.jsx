import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Form, Input, InputNumber, Button, Select, Row, Col, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import ItemRow from '@/modules/ErpPanelModule/ItemRow';
import { selectFinanceSettings } from '@/redux/settings/selectors';
import { useDate, useMoney } from '@/settings';
import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';
import SelectAsync from '@/components/SelectAsync';

export default function InvoiceForm({ current = null }) {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { last_invoice_number = 0 } = useSelector(selectFinanceSettings) || {};
  const { currency_symbol } = useMoney();
  const [taxRate, setTaxRate] = useState(0);
  const [totals, setTotals] = useState({ subTotal: 0, taxTotal: 0, total: 0 });
  const currentYear = new Date().getFullYear();
  const lastNumber = (last_invoice_number || 0) + 1;
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
      const { taxRate: currentTaxRate = 0, items = [] } = current;
      const rate = currentTaxRate >= 1 ? currentTaxRate / 100 : currentTaxRate;
      setTaxRate(rate);
      currentItems.current = items;
      calculateTotals(items, rate);
    }
  }, [current]);

  // Recalculate totals when taxRate changes
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
    <div style={{ minHeight: '100vh' }}>
      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => {
        const itemsChanged = prevValues.items !== currentValues.items;
        const taxChanged = prevValues.taxRate !== currentValues.taxRate;
        
        // Store current items for tax recalculation
        if (currentValues.items) {
          currentItems.current = currentValues.items;
        }
        
        // Update tax rate state when form value changes
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
      {/* Client & Basic Info */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        padding: '24px', 
        borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>
          {translate('Basic Information')}
        </h3>
        <Row gutter={16}>
          <Col xs={24} md={12}>
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
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={4}>
            <Form.Item
              label={translate('Number')}
              name="number"
              initialValue={lastNumber}
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={4}>
            <Form.Item
              label={translate('Year')}
              name="year"
              initialValue={currentYear}
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
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
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="date"
              label={translate('Invoice Date')}
              rules={[{ required: true, type: 'object' }]}
              initialValue={dayjs()}
            >
              <DatePicker style={{ width: '100%' }} format={dateFormat} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="expiredDate"
              label={translate('Due Date')}
              rules={[{ required: true, type: 'object' }]}
              initialValue={dayjs().add(30, 'days')}
            >
              <DatePicker style={{ width: '100%' }} format={dateFormat} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label={translate('Notes')} name="notes">
              <Input placeholder={translate('Add notes...')} />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* Items Section */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        padding: '24px', 
        borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>
          {translate('Items')}
        </h3>

        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col span={5}>
            <strong style={{ fontSize: 13, color: '#FFFFFF' }}>{translate('Item')}</strong>
          </Col>
          <Col span={7}>
            <strong style={{ fontSize: 13, color: '#FFFFFF' }}>{translate('Description')}</strong>
          </Col>
          <Col span={3}>
            <strong style={{ fontSize: 13, color: '#FFFFFF' }}>{translate('Qty')}</strong>
          </Col>
          <Col span={4}>
            <strong style={{ fontSize: 13, color: '#FFFFFF' }}>{translate('Price')}</strong>
          </Col>
          <Col span={5}>
            <strong style={{ fontSize: 13, color: '#FFFFFF' }}>{translate('Total')}</strong>
          </Col>
        </Row>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <ItemRow key={field.key} remove={remove} field={field} current={current} />
              ))}
              <Form.Item style={{ marginTop: 16, marginBottom: 0 }}>
                <Button
                  type="dashed"
                  onClick={() => add({ quantity: 1, price: 0, total: 0 })}
                  block
                  icon={<PlusOutlined />}
                  ref={addField}
                  style={{ 
                    height: 40,
                    borderColor: '#3B82F6',
                    color: '#3B82F6'
                  }}
                >
                  {translate('Add Item')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>

      {/* Totals Section */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        padding: '24px', 
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
        marginBottom: '40px'
      }}>
        <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>
          {translate('Summary')}
        </h3>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="taxRate"
              label={translate('Tax Rate')}
              rules={[{ required: true, message: translate('Please select tax rate') }]}
            >
              <SelectAsync
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
          <Col xs={24} md={12}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              padding: 20, 
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <Row style={{ marginBottom: 12 }}>
                <Col span={12}>
                  <span style={{ fontWeight: 500, color: '#FFFFFF' }}>{translate('Subtotal')}:</span>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 500, color: '#FFFFFF' }}>
                    {currency_symbol} {totals.subTotal.toFixed(2)}
                  </span>
                </Col>
              </Row>
              <Row style={{ marginBottom: 12 }}>
                <Col span={12}>
                  <span style={{ fontWeight: 500, color: '#FFFFFF' }}>{translate('Tax')}:</span>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 500, color: '#FFFFFF' }}>
                    {currency_symbol} {totals.taxTotal.toFixed(2)}
                  </span>
                </Col>
              </Row>
              <Divider style={{ margin: '12px 0' }} />
              <Row>
                <Col span={12}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>{translate('Total')}:</span>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>
                    {currency_symbol} {totals.total.toFixed(2)}
                  </span>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
