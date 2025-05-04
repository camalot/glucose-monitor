$(() => {
  BootstrapInitializer.initialize();

  const dataLoader = new DataLoader();
  dataLoader.loadData();

  const refreshRateManager = new RefreshRateManager();
  refreshRateManager.initialize();

  const timeframeManager = new TimeframeManager();
  timeframeManager.initialize();

  const autocomplete = new AutocompleteLoader();
  autocomplete.initialize();

  FoodSearchLoader.initialize();

  const unitDropdown = new UnitDropdownInitializer();
  unitDropdown.initialize();

});

class BootstrapInitializer {
  static initialize() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }
}

class FoodSearchResultInitializer {
  static initialize(target) {
    // data-action="selectFoodItem"
    const $target = $(target);
    $target.off("click").on("click", (event) => {
      const $t = $(event.currentTarget);
      const template = $t.closest('[data-template="foodItem"]');
      const $data = $("data[data-bind='json']", template);
      // if $data.text() is wrapped in quotes, remove the quotes
      const foodDataText = $data.text().replace(/^\s*"|\s*"$/g, '');
      console.log(foodDataText);
      const foodItem = JSON.parse(foodDataText);

      const $form = $t.closest("form");
      if ($form.get(0)) {
        for(const key in foodItem) {
          const inputField = $form.find(`input[name="${key}"]`);
          if (inputField.length) {
            inputField.val(foodItem[key]);
          }
        }

        $form.find('[role="close"]').trigger('click');
      }
    });
  }
}

class RefreshRateManager {
  constructor() {
    this.refreshTimer = null;
  }

  setSavedRefreshRate(rate) {
    localStorage.setItem('refreshRate', rate);
  }

  changeRefreshRate(event) {
    const rateButton = $("button[data-role='refresh-rate-dropdown']");
    $("button[data-role='refresh-rate'].dropdown-item").removeClass("active");
    const $selected = $(event.currentTarget);
    const selectedRate = $selected.addClass("active").text();
    $(rateButton).text(selectedRate);

    clearInterval(this.refreshTimer);
    // Get selected rate
    const rate = $selected.data("value");
    if (rate !== "") {
      this.refreshTimer = setInterval(() => {
        DataLoader.reloadData();
      }, rate);
    }
    this.setSavedRefreshRate(rate);
  }

  initialize() {
    $("button[data-role='refresh-rate'].dropdown-item").on("click", (event) => this.changeRefreshRate(event));
    $("button[data-role='refresh']").on("click", () => DataLoader.reloadData());

    const savedRefreshRate = localStorage.getItem('refreshRate');
    if (savedRefreshRate != null) {
      $("button[data-role='refresh-rate'].dropdown-item").removeClass("active");
      const targetMenuItem = $(`button[data-role='refresh-rate'][data-value='${savedRefreshRate}']`);
      targetMenuItem.trigger("click");
    }
  }
}

class TimeframeManager {
  setSavedTimeframeRate(rate) {
    localStorage.setItem('timeframeRate', rate);
  }

  changeTimeframeRate(event) {
    const rateButton = $("button[data-role='timeframe-dropdown']");
    $("button[data-role='timeframe'].dropdown-item").removeClass("active");
    const $selected = $(event.currentTarget);
    const selectedRate = $selected.addClass("active").text();
    // Get selected rate
    const rate = $selected.data("value");
    // Update the dropdown label to be the selected label
    const label = rateButton.find('span[role="label"]');
    $(label).text(selectedRate);
    this.setSavedTimeframeRate(rate);

    // Call reloadData
    DataLoader.reloadData();
  }

  initialize() {
    $("button[data-role='timeframe'].dropdown-item").on("click", (event) => this.changeTimeframeRate(event));

    const savedTimeframeRate = localStorage.getItem('timeframeRate');
    if (savedTimeframeRate != null) {
      $("button[data-role='timeframe'].dropdown-item").removeClass("active");
      const targetMenuItem = $(`button[data-role='timeframe'][data-value='${savedTimeframeRate}']`);
      targetMenuItem.trigger("click");
    }

    if (!savedTimeframeRate) {
      const defaultTimeframe = $("button[data-role='timeframe'][data-value='90d']");
      defaultTimeframe.trigger("click");
    }
  }
}

class UnitDropdownInitializer {
  initialize() {
    // data-role="unit-dropdown"

    const dropdownButtons = $('[data-role="unit-dropdown"]');
    // for each in dropdownButtons
    dropdownButtons.each((index, dropdownButton) => {

      const groupDataId = $(dropdownButton).data("dropdown-id");
      const hiddenField = $(`input[data-id="${groupDataId}"][data-role="unit-value"]`);
      const dropdownItems = $(`[data-id="${groupDataId}"] button[data-role="unit"]`);

      dropdownItems.on("click", (event) => {
        dropdownItems.not(event.currentTarget).removeClass("active");
        const selectedUnit = $(event.currentTarget).data("value");
        $(event.currentTarget).addClass("active");
        const dataId = $(event.currentTarget).data("id");
        const hiddenField = $(`input[data-id="${dataId}"][data-role="unit-value"]`);
        hiddenField.val(selectedUnit);
        $(dropdownButton).find('span[role="label"]').text(selectedUnit);
      });
    });
  }
}

class FoodSearchLoader {
  static initialize() {
    FoodSearchLoader.expanderInitialize();
    FoodSearchLoader.clearButtonInitialize();
    FoodSearchLoader.searchButtonInitialize();
  }

  static searchButtonInitialize() {
    $("button[data-search]").on("click", (event) => {
      const target = $(event.currentTarget);

      const searchField = target.data("search-field");
      const searchValue = $(`#${searchField}`).val();

      const searchUrl = target.data("search");
      const searchParam = target.data("search-param");

      const resultsContainer = $(`[role='search-results'][data-results='${searchField}']`);
      const resultsList = $(resultsContainer).find("ul.list-group");

      // update the search button to show a bootstrap spinner and disable the button
      target.prop('disabled', true).find('i').addClass('d-none');
      target.find(".spinner-grow").removeClass('d-none');

      // once success (of failure) of the search request, revert back to show the <i class="fa fa-search"></i> and enable

      $.ajax({
        url: `${searchUrl}`,
        method: 'GET',
        data: {
          [searchParam]: searchValue
        },
        success: (data) => {

          target.prop('disabled', false).find('i').removeClass('d-none');
          target.find(".spinner-grow").addClass('d-none');

          // find the form
          const form = target.closest("form");
          resultsList.empty();

          for (const item of data.results) {
            item.description = item.description || item.serving || '';
            // remove `${item.name}\s?-\s?` from the description
            item.description = item.description.replace(new RegExp(`${item.name}\\s?-\\s?`, 'g'), '');
            const renderedItem = Templates.render(resultsList, 'foodItem', item);

            FoodSearchResultInitializer.initialize(renderedItem);
          }

          resultsContainer.removeClass("d-none");
        },
        error: (error) => {
          target.prop('disabled', false).find('i').removeClass('d-none');
          target.find(".spinner-grow").addClass('d-none');

          console.error("Error during search:", error);
        }
      });
    });
  }

  static expanderInitialize() {
    // role="expand" data-expand="food-search" data-expand-class="col-9"
    const expander = $('[role="expand"]');
    const fieldId = expander.data('expand');
    const field = expander.find(`input#${fieldId}`);
    const targetClass = expander.data('expand-class');

    const toggles = {
      expand: () => {
        expander.addClass(targetClass);
      },
      collapse: () => {
        expander.removeClass(targetClass);
      }
    };

    field.on('focus', (event) => {
      console.log('Expander focused');
      toggles.expand();
    }).on('blur', (event) => {
      const val = field.val();
      console.log(field);
      console.log(`value: ${val}`);
      if (val === "") {
        console.log('Expander blur');
        toggles.collapse();
      }
    }).trigger('blur');
    expander.on('click', (event) => {
      field.focus();
    });
  }

  static clearButtonInitialize() {
    $("button[role='close'][data-target]").on("click", (event) => {
      const $this = $(event.currentTarget);
      const target = $this.data("target");
      $(target).addClass("d-none");
      $("ul", target).empty();

      const clearTarget = $this.data("clear");
      console.log(`clearTarget = ${clearTarget}`);
      if (clearTarget) {
        console.log(`clearing ${clearTarget}`);
        $(`${clearTarget}`).val('');
      }
    }).trigger("click");
  }
}

class AutocompleteLoader {
  initialize() {

    // bind the change event of the autocomplete input
    const autocompleteInput = $("[list][data-autocomplete]");
    autocompleteInput.each((item) => {
      const dlId = $(item).attr('list');
      const dl = $(`#${dlId}`);
      dl.off("change").on('change', (event) => {
        const selectedValue = $(event.target).val();
      });
    });

    // when you click somewhere else, clear the list
    $(document).on("click", (event) => {
      const target = $("[data-autocomplete-list]");
      if (target.length) {
        $(target).addClass("d-none").empty();
      }
    });

    // for the autocomplete field
    $("[data-autocomplete]")
      // remove the event handlers
      .off("keydown")
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
              suggestions.addClass("d-none").removeClass("d-block mt-1");
              suggestions.empty();
              $(event.target).focus();
            }
          }
        }
      })
      .on("input", (event) => {
        const field = $(event.currentTarget);
        const fieldId = field.attr('id');
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
              suggestions.removeClass("d-none").addClass("d-block mt-1");
            }
            suggestions.empty();
            data.forEach(item => {
              const listItem = Templates.render(suggestions, 'foodSuggestions', item);
              listItem.on("click", (event) => {
                const selectedValue = $(event.currentTarget).find('[data-bind="value"]').text();
                field.val(selectedValue);
                suggestions.addClass("d-none").removeClass("d-block mt-1");
                suggestions.empty();
                field.focus();
              });
            });
            if (data.length === 0) {
              suggestions.addClass("d-none").removeClass("d-block mt-1");
            }
          }
        });
      });
  }
}

class DataLoader {
  constructor() { }

  static reloadData() {
    // If tab not active or visible, return
    if (!document.hidden) {
      const dataLoader = new DataLoader();
      dataLoader.loadData();
    }
  }

  static setBackground(card, background = 'bg-body-tertiary') {
    card
      .removeClass('bg-dark')
      .removeClass('bg-success')
      .removeClass('bg-primary')
      .removeClass("bg-danger")
      .removeClass('bg-warning')
      .removeClass('bg-secondary')
      .removeClass('bg-body-tertiary')
      .removeClass('bg-info')
      .addClass(background);
  }

  static setPlaceholder(card, enabled) {
    if (enabled) {
      card.addClass("placeholder-glow");
      $(card).find('.placeholder-field').addClass("placeholder");
    } else {
      card.removeClass("placeholder-glow");
      $(card).find('.placeholder-field').removeClass("placeholder");
    }
  }

  async loadData() {
    return new Promise(async (resolve, reject) => {
      try {

        const $spinner = $(".loader-spinner");
        DataLoader.setBackground($spinner, 'bg-info');
        $spinner.removeClass("d-none fade-out");

        $spinner.addClass("d-flex").attr('style', '');

        $('.placeholder-field').addClass('placeholder');

        await this.loadA1C();
        await this.loadGlucose();
        await this.loadCharts();
        await this.loadFoods();
        await this.loadCarbsCard();
        await this.loadCaloriesCard();
        
        $spinner.removeClass("d-flex").addClass("fade-out").attr('style', '');
        resolve();
      } catch (error) {
        console.error("Error loading data:", error);
        DataLoader.setBackground($spinner, 'bg-danger');
        $spinner.attr('title', 'Error loading data');
        reject(error);
      }
    });
  }

  async loadFoods() {
    return new Promise(async (resolve, reject) => {
      let $card = $('.food.reading-entry');
      let tfStorageKey = $card.data('timeframe');
      let timeframe = localStorage.getItem(tfStorageKey) || null;
      DataLoader.setPlaceholder($card, true);
      DataLoader.setBackground($card, 'bg-dark');
      $.ajax({
        url: '/api/v1/food/list/10',
        data: { timeframe: timeframe },
        method: 'GET',
        success: (data) => {
          try {
            let list = $('.food-list', $card);
            list.empty();

            data.forEach(item => {
              item.time = moment.unix(Number(item.timestamp || 0)).fromNow();
              Templates.render(list, "foodEntryItem", item);
            });

            DataLoader.setPlaceholder($card, false);
            DataLoader.setBackground($card, 'bg-body-tertiary');
            resolve();
          } catch (err) {
            console.error('Error fetching food data:', err);
            DataLoader.setPlaceholder($card, true);
            DataLoader.setBackground($card, 'bg-danger');
            resolve();
          }
        },
        error: (error) => {
          console.error('Error fetching food data:', error);
          DataLoader.setPlaceholder($card, true);
          DataLoader.setBackground($card, 'bg-danger');
          resolve();
        }
      });
    });
  }

  async loadGlucose() {
    return new Promise(async (resolve, reject) => {
      let $card = $('.glucose.reading-entry');
      let tfStorageKey = $card.data('timeframe');
      let timeframe = localStorage.getItem(tfStorageKey) || null;
      DataLoader.setPlaceholder($card, true);
      DataLoader.setBackground($card, 'bg-dark');
      $.ajax({
        url: '/api/v1/glucose/last',
        data: { timeframe: timeframe },
        method: 'GET',
        success: (data) => {
          try {
            // $('.reading-entry-value', $card).text(data.value);
            // $('.last-updated', $card).text(moment(data.time).fromNow());

            data.time = moment.unix(data.timestamp).fromNow();
            const $container = $('[data-container="value-card"]', $card).empty();
            console.log($container);
            console.log(data);
            Templates.render($container, 'value-card', data);


            // get glucose card bg color
            if (data.value < 80) {
              DataLoader.setBackground($card, 'bg-primary');
            } else if (data.value >= 80 && data.value <= 180) {
              DataLoader.setBackground($card, 'bg-success');
            } else {
              DataLoader.setBackground($card, 'bg-danger');
            }
            DataLoader.setPlaceholder($card, false);
            resolve();
          } catch (err) {
            console.error('Error fetching glucose data:', err);
            DataLoader.setPlaceholder($card, true);
            DataLoader.setBackground($card, 'bg-danger');
            resolve();
          }
        },
        error: function (error) {
          console.error('Error fetching glucose data:', error);
          DataLoader.setPlaceholder($card, true);
          DataLoader.setBackground($card, 'bg-danger');
          resolve();
        }
      });
    });
  }

  async loadA1C() {
    return new Promise(async (resolve, reject) => {
      let $card = $('.a1c.reading-entry');
      let tfStorageKey = $card.data('timeframe');
      let timeframe = localStorage.getItem(tfStorageKey) || null;
      DataLoader.setPlaceholder($card, true);
      DataLoader.setBackground($card, 'bg-dark');
      $.ajax({
        url: '/api/v1/glucose/a1c',
        data: { timeframe: timeframe },
        method: 'GET',
        success: function (data) {
          try {
            data.time = moment.unix(data.timestamp).fromNow();
            const $container = $('[data-container="value-card"]', $card).empty();
            Templates.render($container, 'value-card', data);

            // get a1c card bg color
            if (data.value < 5.7) {
              DataLoader.setBackground($card, 'bg-success');
            } else if (data.value >= 5.7 && data.value <= 6.4) {
              DataLoader.setBackground($card, 'bg-warning');
            } else {
              DataLoader.setBackground($card, 'bg-danger');
            }
            DataLoader.setPlaceholder($card, false);
            resolve();
          } catch (err) {
            console.error('Error fetching glucose data:', err);
            DataLoader.setPlaceholder($card, true);
            DataLoader.setBackground($card, 'bg-danger');
            resolve();
          }
        },
        error: function (error) {
          console.error('Error fetching glucose data:', error);
          DataLoader.setPlaceholder($card, true);
          DataLoader.setBackground($card, 'bg-danger');
          resolve();
        }
      });
    });
  }

  async loadCarbsCard() {
    return new Promise(async (resolve, reject) => {
      let $card = $('.carbs.reading-entry');
      let tfStorageKey = $card.data('timeframe');
      let timeframe = localStorage.getItem(tfStorageKey) || null;
      DataLoader.setPlaceholder($card, true);
      DataLoader.setBackground($card, "bg-dark");
      $.ajax({
        url: '/api/v1/food/carbs/today',
        data: { timeframe: '0d' },
        method: 'GET',
        success: function (data) {
          try {
            data.time = moment.unix(data.timestamp).fromNow();
            const $container = $('[data-container="value-card"]', $card).empty();
            Templates.render($container, 'value-card', data);
            DataLoader.setBackground($card, "bg-body-tertiary");
            DataLoader.setPlaceholder($card, false);
            resolve();
          } catch (err) {
            console.error('Error fetching carbs data:', err);
            DataLoader.setBackground($card, "bg-danger");
            DataLoader.setPlaceholder($card, true);
            resolve();
          }
        },
        error: function (error) {
          console.error('Error fetching carbs data:', error);
          DataLoader.setPlaceholder($card, true);
          DataLoader.setBackground($card, "bg-danger");
          resolve();
        }
      });
    });
  }

  async loadCaloriesCard() {
    return new Promise(async (resolve, reject) => {
      let $card = $('.calories.reading-entry');
      let tfStorageKey = $card.data('timeframe');
      let timeframe = localStorage.getItem(tfStorageKey) || null;
      DataLoader.setPlaceholder($card, true);
      DataLoader.setBackground($card, "bg-dark");
      $.ajax({
        url: '/api/v1/food/calories/today',
        data: { timeframe: '0d' },
        method: 'GET',
        success: function (data) {
          try {
            data.time = moment.unix(data.timestamp).fromNow();
            const $container = $('[data-container="value-card"]', $card).empty();
            Templates.render($container, 'value-card', data);
            DataLoader.setPlaceholder($card, false);
            DataLoader.setBackground($card, "bg-body-tertiary");
            resolve();
          } catch (err) {
            console.error('Error processing calories data:', err);
            DataLoader.setPlaceholder($card, true);
            DataLoader.setBackground($card, "bg-danger");
            resolve();
          }
        },
        error: function (error) {
          console.error('Error fetching calories data:', error);
          DataLoader.setPlaceholder($card, true);
          DataLoader.setBackground($card, "bg-danger");
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
        try {
          const dataChart = new DataChart();
          dataChart.initialize(chartId, {
            data: [],
            label: chart.options.label,
            yAxisLabel: chart.options.yAxisLabel
          });
        } catch (err) {
          // ignore
        }

        let chart = charts[chartId];
        let $card = $(`.chart.${chartId}`);
        let tfStorageKey = $card.data('timeframe');
        let timeframe = localStorage.getItem(tfStorageKey) || null;
        DataLoader.setPlaceholder($card, true);
        DataLoader.setBackground($card, 'bg-dark');
        $.ajax({
          url: chart.url,
          data: { timeframe: timeframe },
          method: 'GET',
          success: function (data) {
            try {
              const dataChart = new DataChart();
              dataChart.initialize(chartId, {
                data: data,
                label: chart.options.label,
                yAxisLabel: chart.options.yAxisLabel
              });

              DataLoader.setPlaceholder($card, false);
              DataLoader.setBackground($card, "bg-body-tertiary");
            } catch (err) {
              console.error('Error fetching data:', err);
              DataLoader.setPlaceholder($card, true);
              DataLoader.setBackground($card, "bg-danger");
            }
          },
          error: function (error) {
            console.error('Error fetching data:', error);
            DataLoader.setPlaceholder($card, true);
            DataLoader.setBackground($card, "bg-danger");
          }
        });
      }
      resolve();
    });
  }
}