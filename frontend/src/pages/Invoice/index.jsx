import dayjs from 'dayjs';
import { Tag } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { tagColor } from '@/utils/statusTagColor';

import { useMoney, useDate } from '@/settings';
import InvoiceDataTableModule from '@/modules/InvoiceModule/InvoiceDataTableModule';

export default function Invoice() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'invoice';
  const moneySettings = useMoney();

  // Safe money formatter with fallback
  const formatMoney = (amount, currency_code) => {
    // Convert to number and handle undefined/null/NaN
    const numAmount = parseFloat(amount);
    
    // If amount is not a valid number, return 0.00
    if (isNaN(numAmount) || numAmount === null || numAmount === undefined) {
      console.warn('Invalid amount:', amount);
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
      console.error('Money formatter error in list:', error, 'Amount:', numAmount);
      const symbol = moneySettings?.currency_symbol || '$';
      return `${symbol} ${numAmount.toFixed(2)}`;
    }
  };

  const searchConfig = {
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['number', 'client.name'];
  const dataTableColumns = [
    {
      title: translate('Number'),
      dataIndex: 'number',
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
    },
    {
      title: translate('Date'),
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('expired Date'),
      dataIndex: 'expiredDate',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => {
        return formatMoney(total, record.currency);
      },
    },
    {
      title: translate('paid'),
      dataIndex: 'credit',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => formatMoney(total, record.currency),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
    },
    {
      title: translate('Payment'),
      dataIndex: 'paymentStatus',
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('invoice'),
    DATATABLE_TITLE: translate('invoice_list'),
    ADD_NEW_ENTITY: translate('add_new_invoice'),
    ENTITY_NAME: translate('invoice'),

    RECORD_ENTITY: translate('record_payment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return <InvoiceDataTableModule config={config} />;
}
