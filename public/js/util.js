//Utility Object
var util = {
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