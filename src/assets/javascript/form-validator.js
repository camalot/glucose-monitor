(function () {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(function (form) {
    $(form)
    .on('reset', (event) => {
      const $form = $(form);
      $form.removeClass('was-validated');
      console.log("reset form");

      $("button[role='close'][data-target]").trigger('click');
      
      // const $resets = $form.find(`[data-reset="${form.id}"]`);
      const $resets = $('[data-reset]', $form);
      $resets.empty().val('');

      $('[type="datetime-local"]').val(moment().format('YYYY-MM-DDTHH:mm'));
    })
    .on('submit', (event) => {
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
            // console.log(data);
            // console.log(response);

            // reset form and close modal
            $form[0].reset();
            $form.closest('.modal').modal('hide'); // Close the modal (assuming the modal has an ID of 'myModal')
            $form.removeClass("was-validated");
            DataLoader.reloadData();

            const successMessage = 'Form submitted successfully!';
            toastr.success(successMessage);

          },
          error: function (error) {
            // console.log(data);
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
    }).trigger('reset');
  });
})();