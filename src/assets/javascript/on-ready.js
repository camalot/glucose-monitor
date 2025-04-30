$(() => {
  const dataLoader = new DataLoader();
  dataLoader.loadData();
  const autocomplete = new AutocompleteLoader();
  autocomplete.initialize();
  const foodSearch = new FoodSearchLoader();
  foodSearch.initialize();

  $("button[data-role='refresh-rate'].dropdown-item").on("click", changeRefreshRate);
  $("button[data-role='refresh']").on("click", reloadData);

  const savedRate = localStorage.getItem('refreshRate');
  if (savedRate != null) {
    $("button[data-role='refresh-rate'].dropdown-item").removeClass("active");
    const targetMenuItem = $(`button[data-role='refresh-rate'][data-value='${savedRate}']`);
    targetMenuItem.trigger("click");
  }

  moment.tz.setDefault("UTC");
});

let refreshTimer = null;

function reloadData() {
    // if tab not active or visible, return
    if (!document.hidden) {
      const $spinner = $(".loader-spinner");
      DataLoader.setBackground($spinner, 'bg-info');
      $spinner.removeClass("d-none fade-out")

      $spinner.addClass("d-flex").attr('style', '');
      const dataLoader = new DataLoader();
      dataLoader.loadData().then(() => {
        $spinner.removeClass("d-flex").addClass("fade-out").attr('style', '');
      }).catch((error) => {
        console.error("Error loading data:", error);
        DataLoader.setBackground($spinner, 'bg-danger');
        $spinner.attr('title', 'Error loading data');
      });
    }
}

function setSavedRefreshRate(rate) {
  console.log(`set saved refresh rate: ${rate}`);
  localStorage.setItem('refreshRate', rate);
}

function changeRefreshRate(event) {
  console.log("changeRefreshRate");
  const rateButton = $("button[data-role='refresh-rate-dropdown']");
  $("button[data-role='refresh-rate'].dropdown-item").removeClass("active");
  const $selected = $(event.currentTarget);
  const selectedRate = $selected.addClass("active").text();
  $(rateButton).text(selectedRate);
  console.log(`Refresh rate changed to: ${selectedRate}`);

  clearInterval(refreshTimer);
  // get selected rate
  const rate = $selected.data("value");
  if (rate !== "") {
    console.log(`Selected refresh rate value: ${rate}`);
    refreshTimer = setInterval(reloadData, rate);
  }
  setSavedRefreshRate(rate);
}

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

  static setBackground(card, background = 'bg-body-tertiary') {
    card
      .removeClass("placeholder-glow")
      .removeClass('bg-dark')
      .removeClass('bg-success')
      .removeClass('bg-primary')
      .removeClass("bg-danger")
      .removeClass('bg-warning')
      .removeClass('bg-secondary')
      .removeClass('bg-body-tertiary')
      .removeClass('bg-info')
      .addClass(background);
    $('.placeholder', card).removeClass('placeholder');
  }

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
      let $card = $('.food.reading-entry');
      DataLoader.setBackground($card, 'bg-dark');
      $.ajax({
        url: '/api/v1/food/list/3',
        method: 'GET',
        success: (data) => {
          try {
            console.log('Food data fetched successfully:', data);
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
            DataLoader.setBackground($card, 'bg-body-tertiary');
            resolve();
          } catch (err) {
            console.error('Error fetching food data:', err);
            DataLoader.setBackground($card, 'bg-danger');
            // reject(err);
            resolve();
          }
        },
        error: (error) => {
          console.error('Error fetching food data:', error);
          DataLoader.setBackground($card, 'bg-danger');
          // reject(error);
          resolve();
        }
      });
    });
  }

  async loadGlucose() {
    return new Promise(async (resolve, reject) => {
      let $card = $('.glucose.reading-entry');
      DataLoader.setBackground($card, 'bg-dark');
      $.ajax({
        url: '/api/v1/glucose/last',
        method: 'GET',
        success: (data) => {
          try {
            console.log('Glucose data fetched successfully:', data);
            $('.reading-entry-value', $card).text(data.value);
            $('.last-updated', $card).text(moment(data.time).fromNow());
            // get glucose card bg color

            if (data.value < 80) {
              DataLoader.setBackground($card, 'bg-primary');
            } else if (data.value >= 80 && data.value <= 180) {
              DataLoader.setBackground($card, 'bg-success');
            } else {
              DataLoader.setBackground($card, 'bg-danger');
            }
            resolve();
          } catch (err) {
            console.error('Error fetching glucose data:', err);
            DataLoader.setBackground($card, 'bg-danger');
            // reject(err);
            resolve();
          }
        },
        error: function (error) {
          console.error('Error fetching glucose data:', error);
          DataLoader.setBackground($card, 'bg-danger');
          // reject(error);
          resolve();
        }
      });
    });
  }

  async loadA1C() {
    return new Promise(async (resolve, reject) => {
      let $card = $('.a1c.reading-entry');
      DataLoader.setBackground($card, 'bg-dark');
      $.ajax({
        url: '/api/v1/glucose/a1c',
        method: 'GET',
        success: function (data) {
          try {
            console.log('A1C data fetched successfully:', data);
            $('.reading-entry-value', $card).text(data.value);
            $('.last-updated', $card).text(moment(data.time).fromNow());

            // get glucose card bg color
            if (data.value < 5.7) {
              DataLoader.setBackground($card, 'bg-success');
            } else if (data.value >= 5.7 && data.value <= 6.4) {
              DataLoader.setBackground($card, 'bg-warning');
            } else {
              DataLoader.setBackground($card, 'bg-danger');
            }
            resolve();
          } catch (err) {
            console.error('Error fetching glucose data:', err);
            DataLoader.setBackground($card, 'bg-danger');
            // reject(err);
            resolve();
          }
        },
        error: function (error) {
          console.error('Error fetching glucose data:', error);
          DataLoader.setBackground($card, 'bg-danger');
          // reject(error);
          resolve();
        }
      });
    });
  }

  async loadCarbsCard() {
    return new Promise(async (resolve, reject) => {
      let $card = $('.carbs.reading-entry');
      DataLoader.setBackground($card, "bg-dark");
      $.ajax({
        url: '/api/v1/food/carbs/today',
        method: 'GET',
        success: function (data) {
          try {
            console.log('Carbs data fetched successfully:', data);
            $('.reading-entry-value', $card).text(data.totalCarbs);
            $('.last-updated', $card).text(moment(data.time).fromNow());
            DataLoader.setBackground($card, "bg-body-tertiary");
            resolve();
          } catch (err) {
            console.error('Error fetching carbs data:', err);
            DataLoader.setBackground($card, "bg-danger");
            // reject(err);
            resolve();
          }
        },
        error: function (error) {
          console.error('Error fetching carbs data:', error);
          DataLoader.setBackground($card, "bg-danger");
          // reject(error);
          resolve();
        }
      });
    });
  }

  async loadCaloriesCard() {
    return new Promise(async (resolve, reject) => {
      let $card = $('.calories.reading-entry');
      DataLoader.setBackground($card, "bg-dark");
      $.ajax({
        url: '/api/v1/food/calories/today',
        method: 'GET',
        success: function (data) {
          try {
            console.log('Calories data fetched successfully:', data);
            $('.reading-entry-value', $card).text(data.totalCalories);
            $('.last-updated', $card).text(moment(data.time).fromNow());
            DataLoader.setBackground($card, "bg-body-tertiary");
            resolve();
          } catch (err) {
            console.error('Error processing calories data:', err);
            DataLoader.setBackground($card, "bg-danger");
            // reject(err);
            resolve();
          }
        },
        error: function (error) {
          console.error('Error fetching calories data:', error);
          DataLoader.setBackground($card, "bg-danger");
          // reject(error);
          resolve();
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
        let $card = $(`.chart.${chartId}`);
        DataLoader.setBackground($card, 'bg-dark');
        $.ajax({
          url: chart.url,
          method: 'GET',
          success: function (data) {
            try {
              console.log('Data fetched successfully:', data);
              const dataChart = new DataChart();
              dataChart.initialize(chartId, {
                data: data,
                label: chart.options.label,
                yAxisLabel: chart.options.yAxisLabel
              });

              // $(`.chart.${chartId}`)
              //   .addClass('bg-body-tertiary')
              //   .removeClass('placeholder-glow')
              //   .removeClass('bg-dark');

              DataLoader.setBackground($card, "bg-body-tertiary");
              $(`.chart.${chartId} .chart-canvas`).removeClass('placeholder');
            } catch (err) {
              console.error('Error fetching data:', err);
              DataLoader.setBackground($card, "bg-danger");
            }
          },
          error: function (error) {
            console.error('Error fetching data:', error);

            DataLoader.setBackground($(`.chart.${chartId}`), "bg-danger");
          }
        });
      }
      resolve();
    });
  }

}