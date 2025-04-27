$(() => {
  const dataLoader = new DataLoader();
  dataLoader.loadData();
  const autocomplete = new AutocompleteLoader();
  autocomplete.initialize();
  const foodSearch = new FoodSearchLoader();
  foodSearch.initialize();

  moment.tz.setDefault("UTC");
});

// reload data every 30 seconds
setInterval(() => {
  // if tab not active or visible, return
  if (!document.hidden) {
    $(".loader-spinner").removeClass("d-none").fadeIn(300, () => {
      $(this).addClass("d-flex");
      const dataLoader = new DataLoader();
      dataLoader.loadData();
    });
    $(".loader-spinner").fadeOut(300, () => {
      $(this).removeClass("d-flex").addClass("d-none");
    });
  }
}, 30000);

class FoodSearchLoader {
  initialize() {
    const fsrContainer = $(".fatsecret-search-results");
    fsrContainer.addClass("d-none");
    $("ul", fsrContainer).empty();

    $("#searchFoodButton").on("click", (event) => {
      const target = $(event.currentTarget);
      console.log(target);

      const searchField = target.data("search-field");
      console.log(`searchField: ${searchField}`);
      const searchValue = $(searchField).val();
      console.log("Search button clicked for food:", searchValue);


      const searchUrl = target.data("search");
      const searchParam = target.data("search-param");

      // perform search. 
      // populate fsrContainer.ul
      // - setup click on each item.
      // - hide fsrContainer on item click
      // ensure fsrContainer visible

      console.log(`search url: ${searchUrl}?${searchParam}=${searchValue}`);

      $.ajax({
        url: `${searchUrl}?${searchParam}=${searchValue}`,
        method: 'GET',
        data: {},
        success: (data) => {

          console.log("Search results:", data);
          // find the form
          const form = target.closest("form");

          // foodItem template

          // .fatsecret-search-results
          const fsrContainer = $(".fatsecret-search-results");
          const fsrList = $("ul.list-group", fsrContainer);
          fsrList.empty();

          for (const item of data.foods) {
            const serving = item.servings.length > 0 ? item.servings[0] : null;
            item.serving = serving;
            item.serving_description = serving ? serving.description : '';
            const renderedItem = Templates.render(fsrList, 'foodItem', item);
            // const foodServingContainer = $(".food-serving", renderedItem);
            const renderedItemData = Templates.render(renderedItem, 'foodServing', item.serving);
          };

          fsrContainer.removeClass("d-none");
        },
        error: (error) => {
          console.error("Error during search:", error);
        }
      });
    });
  }
}

class AutocompleteLoader {
  initialize() {
    $('[list][data-autocomplete]').each((item) => {
      const dlId = $(item).attr('list');
      const dl = $(`#${dlId}`);
      dl.off("change").on('change', (event) => {

        const selectedValue = $(event.target).val();
        console.log(`Selected value from data list: ${selectedValue}`);
      });
    });

    $(document).on("click", (event) => {
      const target = $("[data-autocomplete-list]");
      if (target.length) {
        $(target).addClass("d-none").empty();
      }
    });

    $("[data-autocomplete]")
      .off("input focus active")
      // on tab key, if suggestion list is visible, tab the results into the input field
      .on("keydown", (event) => {
        if (event.key === "Tab") {
          const target = $(event.target);
          const suggestions = $("[data-autocomplete-list]:visible");
          if (suggestions.length) {
            event.preventDefault();
            // continue to go to the next with every tab

            const firstSuggestion = suggestions.find("li:first");
            if (firstSuggestion.length) {
              const selectedValue = firstSuggestion.text().trim();
              target.val(selectedValue);
              suggestions.addClass("d-none").removeClass("d-block mt-5");
              suggestions.empty();
              $(event.target).focus();
            }
          }
        }
      })
      .on("input focus active", (event) => {
        const field = $(event.target);
        const query = field.val().toLowerCase();
        const dataListId = field.attr('list');
        const suggestions = $(`#${dataListId}`);

        const url = field.data('autocomplete');
        const qParam = field.data('autocomplete-param');

        // cancel existing call if more input is entered
        if (this.currentRequest) {
          this.currentRequest.abort();
        }

        if (query.length === 0) {
          suggestions.empty();
          return;
        }

        this.currentRequest = $.ajax({
          url: url, // Use the url variable instead of field.data('autocomplete')
          method: 'GET',
          data: { [qParam]: query },
          success: (data) => {
            if (data.length > 0) {
              suggestions.removeClass("d-none").addClass("d-block mt-5");
            }
            suggestions.empty();
            data.forEach(item => {
              const listItem = Templates.render(suggestions, 'foodSuggestions', item);
              listItem.on("click", (event) => {
                const selectedValue = $(event.currentTarget).find('[data-bind="value"]').text();
                $("#FoodName").val(selectedValue);
                suggestions.addClass("d-none").removeClass("d-block mt-5");
                suggestions.empty();
                field.focus();
              });
              // const option = document.createElement('option');
              // option.value = item.value;
              // suggestions.append(option);
            });
            if (data.length === 0) {
              suggestions.addClass("d-none").removeClass("d-block mt-5");
            }
          }
        });
      });
  }
}

class DataLoader {
  constructor() { }

  async loadData() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loadA1C();
        await this.loadGlucose();
        await this.loadCharts();
        await this.loadFoods();
        await this.loadCarbsCard();
        await this.loadCaloriesCard();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async loadFoods() {
    return new Promise(async (resolve, reject) => {
      // let template = $('.food-item-template');
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
            const itemData = {
              name: item.food.name,
              calories: item.food?.calories || 0,
              carbohydrates: item.food?.carbohydrates || 0,
              time: moment(item.time).fromNow()
            }

            Templates.render(list, "foodEntryItem", itemData);
          });
          $card
            .addClass('bg-body-tertiary')
            .removeClass('bg-dark')
            .removeClass("placeholder-glow");
          $('.placeholder', $card).removeClass('placeholder');
          resolve();
        },
        error: (error) => {
          console.log(error);
          console.error('Error fetching food data:', error);
          reject(error);
        }
      });
    });
  }

  async loadGlucose() {
    return new Promise(async (resolve, reject) => {
      $.ajax({
        url: '/api/v1/glucose/last',
        method: 'GET',
        success: function (data) {
          console.log('Glucose data fetched successfully:', data);
          let $card = $('.glucose.reading-entry');
          $('.reading-entry-value', $card).text(data.value);
          $('.last-updated', $card).text(moment(data.time).fromNow());
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
          resolve();
        },
        error: function (error) {
          console.error('Error fetching glucose data:', error);
          $card.removeClass('bg-dark');
          $card.addClass('bg-danger');
          reject(error);
        }
      });
    });
  }

  async loadA1C() {
    return new Promise(async (resolve, reject) => {
      $.ajax({
        url: '/api/v1/glucose/a1c',
        method: 'GET',
        success: function (data) {
          console.log('A1C data fetched successfully:', data);
          let $card = $('.a1c.reading-entry');
          $('.reading-entry-value', $card).text(data.value);
          $('.last-updated', $card).text(moment(data.time).fromNow());
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
          resolve();
        },
        error: function (error) {
          console.error('Error fetching glucose data:', error);
          $card.removeClass('bg-dark');
          $card.addClass('bg-danger');
          reject(error);
        }
      });
    });
  }

  async loadCarbsCard() {
    return new Promise(async (resolve, reject) => {
      $.ajax({
        url: '/api/v1/food/carbs/today',
        method: 'GET',
        success: function (data) {
          console.log('Carbs data fetched successfully:', data);
          let $card = $('.carbs.reading-entry');
          $('.reading-entry-value', $card).text(data.totalCarbs);
          $('.last-updated', $card).text(moment(data.time).fromNow());
          $card.removeClass("placeholder-glow").removeClass("bg-dark").addClass("bg-body-tertiary");
          $('.placeholder', $card).removeClass('placeholder');
          resolve();
        },
        error: function (error) {
          console.error('Error fetching carbs data:', error);
          let $card = $('.carbs.reading-entry');
          $card.removeClass('bg-dark').addClass('bg-danger');
          reject(error);
        }
      });
    });
  }

  async loadCaloriesCard() {
    return new Promise(async (resolve, reject) => {
      $.ajax({
        url: '/api/v1/food/calories/today',
        method: 'GET',
        success: function (data) {
          console.log('Calories data fetched successfully:', data);
          let $card = $('.calories.reading-entry');
          $('.reading-entry-value', $card).text(data.totalCalories);
          $('.last-updated', $card).text(moment(data.time).fromNow());
          $card.removeClass("placeholder-glow").removeClass("bg-dark").addClass("bg-body-tertiary");
          $('.placeholder', $card).removeClass('placeholder');
          resolve();
        },
        error: function (error) {
          console.error('Error fetching calories data:', error);
          let $card = $('.calories.reading-entry');
          $card.removeClass('bg-dark');
          $card.addClass('bg-danger');
          reject(error);
        }
      });
    });
  }

  async loadCharts() {
    return new Promise(async (resolve, reject) => {
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
            reject(error);
          }
        });
      }
      resolve();
    });
  }

}