$(() => {
  const dataLoader = new DataLoader();
  dataLoader.loadData();
});

class DataLoader {
  constructor() {}

  loadData() {
    this.loadA1C();
    this.loadGlucose();
    this.loadCharts();
    this.loadFoods();
  }

  loadFoods() {
    let template = $('.food-item-template');
    console.log('Loading food data...');
    $.ajax({
      url: '/api/v1/food/list/3',
      method: 'GET',
      success: (data) => {
        console.log('Food data fetched successfully:', data);
        let $card = $('.food.reading-entry');
        let list = $('.food-list', $card);
        list.empty();

        data.forEach(item => {
          let clone = template.clone().removeClass('food-item-template').removeClass('d-none');
          console.log(item);
          clone.find('.food-item-name .label').text(item.food.name);
          clone.find('.food-item-calories .label').text('Calories:');
          clone.find('.food-item-calories .value').text(item.food.calories || 0);
          clone.find('.food-item-calories .unit').text('kcal');

          clone.find('.food-item-carbs .label').text('Carbs:');
          clone.find('.food-item-carbs .value').text(item.food.carbohydrates);
          clone.find('.food-item-carbs .unit').text('g');

          clone.find('.food-item-time').text(item.time);
          $('.food-list').append(clone);

          $card
            .addClass('bg-body-tertiary')
            .removeClass('bg-dark')
            .removeClass("placeholder-glow");
          $('.placeholder', $card).removeClass('placeholder');
        });
      },
      error: (error) => {
        console.log(error);
        console.error('Error fetching food data:', error);
      }
    })
    
  }

  loadGlucose() {
    $.ajax({
      url: '/api/v1/glucose/last',
      method: 'GET',
      success: function (data) {
        console.log('Glucose data fetched successfully:', data);
        let $card = $('.glucose.reading-entry');
        $('.reading-entry-value', $card).text(data.value);
        $('.last-updated', $card).text(data.time);
        $card.removeClass("placeholder-glow");
        $('.placeholder', $card).removeClass('placeholder');

        // get glucose card bg color
        $card.removeClass('bg-dark');
        if (data.value < 80) {
          $card.addClass('bg-primary');
        } else if (data.value >= 80 && data.value <= 180) {
          $card.addClass('bg-success');
        } else {
          $card.addClass('bg-danger');
        }
      },
      error: function (error) {
        console.error('Error fetching glucose data:', error);
        $card.removeClass('bg-dark');
        $card.addClass('bg-danger');
      }
    });
  }

  loadA1C() {
    $.ajax({
      url: '/api/v1/glucose/a1c',
      method: 'GET',
      success: function (data) {
        console.log('A1C data fetched successfully:', data);
        let $card = $('.a1c.reading-entry');
        $('.reading-entry-value', $card).text(data.value);
        $('.last-updated', $card).text(data.time);
        $card.removeClass("placeholder-glow");
        $('.placeholder', $card).removeClass('placeholder');

        // get glucose card bg color
        $card.removeClass('bg-dark');
        if (data.value < 5.7) {
          $card.addClass('bg-success');
        } else if (data.value >= 5.7 && data.value <= 6.4) {
          $card.addClass('bg-warning');
        } else {
          $card.addClass('bg-danger');
        }
      },
      error: function (error) {
        console.error('Error fetching glucose data:', error);
        $card.removeClass('bg-dark');
        $card.addClass('bg-danger');
      }
    });
  }
  
  loadCharts() {
    // get chart data and initialize charts.
    let charts = {
      weightChart: {
        url: '/api/v1/weight/chart',
        options: {
          label: 'Weight Entries',
          yAxisLabel: 'Weight (lbs)'
        }
      },
      glucoseChart: {

        url: '/api/v1/glucose/chart',
        options: {
          label: 'Glucose Levels (mg/dL)',
          yAxisLabel: 'Glucose (mg/dL)'
        }
      }
    }

    for (let chartId in charts) {
      let chart = charts[chartId];
      $.ajax({
        url: chart.url,
        method: 'GET',
        success: function (data) {
          console.log('Data fetched successfully:', data);
          const dataChart = new DataChart();
          dataChart.initialize(chartId, {
            data: data,
            label: chart.options.label,
            yAxisLabel: chart.options.yAxisLabel
          });

          $(`.chart.${chartId}`)
            .addClass('bg-body-tertiary')
            .removeClass('placeholder-glow')
            .removeClass('bg-dark');
          $(`.chart.${chartId} .chart-canvas`).removeClass('placeholder');
        },
        error: function (error) {
          console.error('Error fetching data:', error);
        }
      });
    }
  }
}