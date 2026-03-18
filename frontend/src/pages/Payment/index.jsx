import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';
import PaymentDataTableModule from '@/modules/PaymentModule/PaymentDataTableModule';

import { useMoney, useDate } from '@/settings';

export default function Payment() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const moneySettings = useMoney();

  // Safe money formatter with fallback
  const formatMoney = (amount, currency_code) => {
    // Convert to number and handle undefined/null/NaN
    const numAmount = parseFloat(amount);
    
    // If amount is not a valid number, return 0.00
    if (isNaN(numAmount) || numAmount === null || numAmount === undefined) {
      console.warn('Invalid amount in payment:', amount);
      return `${moneySettings?.currency_symbol || '$'} 0.00`;
    }
    
    // If moneySettings is not available, use simple formatting
    if (!moneySettings || !moneySettings.moneyFormatter) {
      const symbol = moneySettings?.currency_symbol || '$';
      return `${symbol} ${numAmount.toFixed(2)}`;
    }
    
    // Try to use the moneyFormatter
    try {
      return moneySettings.moneyFormatter({ amount: numAmount, currency_code });
    } catch (error) {
      console.error('Money formatter error in payment list:', error, 'Amount:', numAmount);
      const symbol = moneySettings?.currency_symbol || '$';
      return `${symbol} ${numAmount.toFixed(2)}`;
    }
  };
  const searchConfig = {
    entity: 'client',
    displayLabels: ['number'],
    searchFields: 'number',
    outputValue: '_id',
  };

  const deleteModalLabels = ['number'];
  const dataTableColumns = [
    {
      title: translate('Payment Number'),

      dataIndex: 'number',
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
    },
    {
      title: translate('Amount'),
      dataIndex: 'amount',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (amount, record) => formatMoney(amount, record.currency),
    },
    {
      title: translate('Date'),
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('Invoice Number'),
      dataIndex: ['invoice', 'number'],
    },
    {
      title: translate('Year'),
      dataIndex: ['invoice', 'year'],
    },
    {
      title: translate('Payment Mode'),
      dataIndex: ['paymentMode', 'name'],
    },
  ];

  const entity = 'payment';

  const Labels = {
    PANEL_TITLE: translate('payment'),
    DATATABLE_TITLE: translate('payment_list'),
    ADD_NEW_ENTITY: translate('add_new_payment'),
    ENTITY_NAME: translate('payment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    disableAdd: true,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };
  return <PaymentDataTableModule config={config} />;
}
