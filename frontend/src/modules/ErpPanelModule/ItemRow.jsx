import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useMoney } from '@/settings';

export default function ItemRow({ field, remove, current }) {
  const { currency_symbol } = useMoney();
  const [itemTotal, setItemTotal] = useState(0);
  
  return (
    <Row gutter={[12, 12]} style={{ position: 'relative', marginBottom: 12 }}>
      <Form.Item noStyle shouldUpdate={(prev, curr) => {
        const prevItems = prev.items || [];
        const currItems = curr.items || [];
        const prevItem = prevItems[field.name] || {};
        const currItem = currItems[field.name] || {};
        
        if (prevItem.quantity !== currItem.quantity || prevItem.price !== currItem.price) {
          const quantity = Number(currItem.quantity) || 0;
          const price = Number(currItem.price) || 0;
          const total = quantity * price;
          setItemTotal(total);
          return true;
        }
        return false;
      }}>
        {() => null}
      </Form.Item>
      
      <Col className="gutter-row" span={5}>
        <Form.Item
          name={[field.name, 'itemName']}
          fieldKey={[field.fieldKey, 'itemName']}
          rules={[{ required: true, message: 'Item name required' }]}
          style={{ marginBottom: 0 }}
        >
          <Input placeholder="Item name" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={7}>
        <Form.Item
          name={[field.name, 'description']}
          fieldKey={[field.fieldKey, 'description']}
          style={{ marginBottom: 0 }}
        >
          <Input placeholder="Description" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={3}>
        <Form.Item
          name={[field.name, 'quantity']}
          fieldKey={[field.fieldKey, 'quantity']}
          rules={[{ required: true, message: 'Qty required' }]}
          initialValue={1}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            min={0}
            placeholder="0"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item
          name={[field.name, 'price']}
          fieldKey={[field.fieldKey, 'price']}
          rules={[{ required: true, message: 'Price required' }]}
          initialValue={0}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            min={0}
            placeholder="0.00"
            precision={2}
            step={0.01}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={5}>
        <div style={{ 
          height: 32, 
          lineHeight: '32px', 
          paddingLeft: 11,
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 4,
          color: '#FFFFFF',
          fontWeight: 500,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {currency_symbol} {itemTotal.toFixed(2)}
        </div>
      </Col>
      <div style={{ position: 'absolute', right: '-32px', top: '5px' }}>
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => remove(field.name)}
          size="small"
        />
      </div>
    </Row>
  );
}
