import { Form, InputNumber, Space } from 'antd';
import { useMoney } from '@/settings';

export default function MoneyInputFormItem({ updatePrice, value = 0, readOnly = false, disabled = false, precision }) {
  const { amountFormatter, currency_symbol, currency_position, cent_precision, currency_code } = useMoney();

  const numericValue = typeof value === 'number' && isFinite(value) ? value : 0;
  const resolvedPrecision = typeof precision === 'number' ? precision : (cent_precision ? cent_precision : 2);

  const formatter = (val) => amountFormatter({ amount: Number(val) || 0, currency_code });
  const parser = (val) => {
    const cleaned = (val || '').toString().replace(/[^0-9.-]/g, '');
    const num = Number(cleaned);
    return isFinite(num) ? num : 0;
  };

  return (
    <Form.Item style={{ marginBottom: 0 }}>
      <Space.Compact style={{ width: '100%' }}>
        {currency_position === 'before' && (
          <span style={{ 
            padding: '4px 11px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '6px 0 0 6px',
            borderRight: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center'
          }}>
            {currency_symbol}
          </span>
        )}
        <InputNumber
          readOnly={readOnly}
          disabled={disabled}
          className="moneyInput"
          onChange={updatePrice}
          precision={resolvedPrecision}
          value={numericValue}
          controls={false}
          formatter={formatter}
          parser={parser}
          style={{ 
            width: '100%',
            borderRadius: currency_position === 'before' ? '0 6px 6px 0' : (currency_position === 'after' ? '6px 0 0 6px' : '6px')
          }}
        />
        {currency_position === 'after' && (
          <span style={{ 
            padding: '4px 11px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '0 6px 6px 0',
            borderLeft: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center'
          }}>
            {currency_symbol}
          </span>
        )}
      </Space.Compact>
    </Form.Item>
  );
}
