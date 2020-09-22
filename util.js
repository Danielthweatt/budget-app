const USDCurrencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

//Utility Object
module.exports = {
    formatUSDCurrency(amount) {
        if (typeof amount === 'string') {
            //Strip commas to convert to float accurately
            amount = amount.replace(/,/g, '');
        }

        amount = parseFloat(amount);

        if (isNaN(amount)) {
            return amount;
        }

        return USDCurrencyFormatter.format(amount);
    }
};