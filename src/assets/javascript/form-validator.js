(function () {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(function (form) {
    $(form).on('submit', (event) => {
      const $form = $(form);
      const valid = $form[0].checkValidity();
      console.log(`form submit: ${$form.attr('id')}`)
      $form.addClass('was-validated');

      if (valid) {
        // TODO: setup form to indicate submission in progress
        const url = $form.data('url') || $form.attr('action');
        const method = $form.data('method') || $form.attr('method') || 'POST';
        const data = $form.serialize();
        $.ajax({
          url: url,
          method: method,
          data: data,
          success: function (response) {
            console.log(data);
            console.log(response);

            // reset form and close modal
            $form[0].reset();
            $form.closest('.modal').modal('hide'); // Close the modal (assuming the modal has an ID of 'myModal')
            $form.removeClass("was-validated");

            const successMessage = 'Form submitted successfully!';
            toastr.success(successMessage);

            const dataLoader = new DataLoader();
            dataLoader.loadData();

          },
          error: function (error) {
            console.log(data);
            console.error(error);

            // toast error

            const toastMessage = 'An error occurred. Please try again.';
            toastr.error(toastMessage);
          }
        });
      } else {
        console.log(`form submission failed: ${$form.attr('id')}`);
      }

      event.preventDefault();
      event.stopPropagation();
    });
  });
})();