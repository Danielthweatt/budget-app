//Utility Object
var util = (function(){
    var USDCurrencyFormatter;

    try {
        USDCurrencyFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
    } catch(e) {
        console.error(e);

        USDCurrencyFormatter = {
            format: function(amount) {
                return '$' + amount.toFixed(2);
            }
        };
    }
    
    return {
        formatUSDCurrency: function(amount) {
            if (typeof amount === 'string') {
                //Strip commas to convert to float accurately
                amount = amount.replace(/,/g, '');
            }
    
            amount = parseFloat(amount);
    
            if (isNaN(amount)) {
                return amount;
            }
    
            return USDCurrencyFormatter.format(amount);
        },
        clearAndDisplayFormSubmissionErrors: function(jqListElement, error) {
            error.details.forEach(function(detail) {
                jqListElement.find('ul').empty().append('<li>' + detail.message + '</li>');
                jqListElement.removeClass('is-hidden');
            });
        },
        getRandomIntInclusive: function(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);

            return Math.floor((Math.random() * (max - min + 1)) + min); 
        },
        getRandomRGB: function() {
            var r = this.getRandomIntInclusive(0, 255);
            var g = this.getRandomIntInclusive(0, 255);
            var b = this.getRandomIntInclusive(0, 255);
            
            return 'rgb(' + r + ', ' + g + ', ' + b + ')';
        },
        createPieChart: function(canvas, data, options) {
            return new Chart(canvas, {
                type: 'pie',
                data: data,
                options: options
            });
        },
        updatePieChart: function(pieChart, newData) {
            pieChart.data = newData;
            pieChart.update();
        }
    };
})();