const currency = require('currency.js');

const useMoney = ({ settings }) => {
  const {
    currency_symbol = '$',
    currency_position = 'before',
    decimal_sep = '.',
    thousand_sep = ',',
    cent_precision = 2,
    zero_format = false,
  } = settings || {};

  function currencyFormat(amount) {
    // Ensure amount is a valid number
    const numAmount = Number(amount) || 0;
    
    try {
      return currency(numAmount).dollars() > 0 || !zero_format
        ? currency(numAmount, {
            separator: thousand_sep,
            decimal: decimal_sep,
            symbol: '',
            precision: cent_precision,
          }).format()
        : 0 +
            currency(numAmount, {
              separator: thousand_sep,
              decimal: decimal_sep,
              symbol: '',
              precision: cent_precision,
            }).format();
    } catch (error) {
      console.error('Currency format error:', error);
      return numAmount.toFixed(cent_precision);
    }
  }

  function moneyFormatter({ amount = 0 }) {
    // Ensure amount is a valid number
    const numAmount = Number(amount) || 0;
    const formattedAmount = currencyFormat(numAmount);
    
    return currency_position === 'before'
      ? `${currency_symbol} ${formattedAmount}`
      : `${formattedAmount} ${currency_symbol}`;
  }

  function amountFormatter({ amount = 0 }) {
    return currencyFormat(amount);
  }

  return {
    moneyFormatter,
    amountFormatter,
    currency_symbol,
    currency_position,
    decimal_sep,
    thousand_sep,
    cent_precision,
    zero_format,
  };
};

module.exports = useMoney;
