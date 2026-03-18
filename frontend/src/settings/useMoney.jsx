import currency from 'currency.js';

import { useSelector } from 'react-redux';
import storePersist from '@/redux/storePersist';

import { selectMoneyFormat } from '@/redux/settings/selectors';

const useMoney = () => {
  const money_format_settings = useSelector(selectMoneyFormat);

  const money_format_state = money_format_settings
    ? money_format_settings
    : storePersist.get('settings')?.money_format_settings;

  function currencyFormat({ amount, currency_code = money_format_state?.currency_code }) {
    // Ensure amount is a valid number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return '0.00';
    }

    // If money_format_state is not available, use simple formatting
    if (!money_format_state) {
      return numAmount.toFixed(2);
    }

    try {
      return currency(numAmount).dollars() > 0 || !money_format_state?.zero_format
        ? currency(numAmount, {
            separator: money_format_state?.thousand_sep || ',',
            decimal: money_format_state?.decimal_sep || '.',
            symbol: '',
            precision: money_format_state?.cent_precision || 2,
          }).format()
        : 0 +
            currency(numAmount, {
              separator: money_format_state?.thousand_sep || ',',
              decimal: money_format_state?.decimal_sep || '.',
              symbol: '',
              precision: money_format_state?.cent_precision || 2,
            }).format();
    } catch (error) {
      console.error('Currency format error:', error);
      return numAmount.toFixed(2);
    }
  }

  function moneyFormatter({ amount = 0, currency_code = money_format_state?.currency_code }) {
    // Ensure amount is a valid number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      const symbol = money_format_state?.currency_symbol || '$';
      return `${symbol} 0.00`;
    }

    const formattedAmount = currencyFormat({ amount: numAmount, currency_code });
    const symbol = money_format_state?.currency_symbol || '$';
    const position = money_format_state?.currency_position || 'before';
    
    return position === 'before'
      ? `${symbol} ${formattedAmount}`
      : `${formattedAmount} ${symbol}`;
  }

  function amountFormatter({ amount = 0, currency_code = money_format_state?.currency_code }) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return '0.00';
    }
    return currencyFormat({ amount: numAmount, currency_code });
  }

  function moneyRowFormatter({ amount = 0, currency_code = money_format_state?.currency_code }) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      const symbol = money_format_state?.currency_symbol || '$';
      return {
        props: {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        },
        children: `${symbol} 0.00`,
      };
    }

    const formattedAmount = currencyFormat({ amount: numAmount, currency_code });
    const symbol = money_format_state?.currency_symbol || '$';
    const position = money_format_state?.currency_position || 'before';

    return {
      props: {
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
          direction: 'ltr',
        },
      },
      children: (
        <>
          {position === 'before'
            ? `${symbol} ${formattedAmount}`
            : `${formattedAmount} ${symbol}`}
        </>
      ),
    };
  }

  return {
    moneyRowFormatter,
    moneyFormatter,
    amountFormatter,
    currency_symbol: money_format_state?.currency_symbol,
    currency_code: money_format_state?.currency_code,
    currency_position: money_format_state?.currency_position,
    decimal_sep: money_format_state?.decimal_sep,
    thousand_sep: money_format_state?.thousand_sep,
    cent_precision: money_format_state?.cent_precision,
    zero_format: money_format_state?.zero_format,
  };
};

export default useMoney;
