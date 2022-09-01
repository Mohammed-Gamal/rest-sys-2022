<template lang="pug">
div
  <!-- Modal trigger button -->
  button(
    type="button",
    class="btn btn-primary px-4",
    data-bs-toggle="modal",
    :data-bs-target="'#EditCatModal' + index"
  ) Edit

  <!-- Modal -->
  div(
    class="modal fade",
    :id="'EditCatModal' + index",
    tabindex="-1",
    :aria-labelledby="'EditCatModal' + index",
    aria-hidden="true",
  )
    div(class="modal-dialog modal-lg modal-dialog-scrollable")
      div(class="modal-content")

        div(class="modal-header")
          h5(class="modal-title", :id="'EditCatModal' + index")
            | Edit Category
          button(type="button", class="btn-close", data-bs-dismiss="modal", aria-label="Close")

        div(class="modal-body d-flex flex-column justify-content-center align-items-center")
          h5(class="text-danger mb-4") Are you sure you wanna apply these changes?

          form(action="#", @submit.prevent novalidate)
            h3(class="text-center mb-4") Category data
            div(class="row mb-3 gap-3 gap-md-0")
              div(class="mb-3 mx-auto w-75")
                div(class="form-floating")
                  input(
                    v-model.trim="name",
                    type="text",
                    name="name",
                    placeholder="Restaurant name",
                    id="nameInputFloat",
                    class="form-control form-control-lg"
                  )
                  label(for="nameInputFloat") Category name
                div(v-if="v$.name.$error", class="p-1 text-danger")
                  | {{ v$.name.$errors[0].$message }}
                hr(class="hr")

              div(class="d-flex flex-column justify-content-center align-items-center gap-4 mt-5")
                button(
                  type="btn",
                  class="btn btn-secondary btn-lg px-md-5",
                  @click="resetAll()",
                  :disabled="editStatus.success || editStatus.fail",
                ) Reset

                 //- Alert
                main-alert(
                  :toggleSuccess="editStatus.success",
                  :toggleFail="editStatus.fail",
                  :text="editStatus.success ? 'Operation done!' : 'Failed to perform operation!'"
                )

        div(class="modal-footer")
          button(
            type="button",
            class="btn btn-warning",
            @click="handleEdit(data.id)",
            :disabled="editStatus.success || editStatus.fail",
          ) Apply Changes
          button(
            type="button",
            class="btn btn-secondary",
            data-bs-dismiss="modal",
            :disabled="editStatus.success || editStatus.fail",
          ) Cancel
</template>

<script>
import useValidate from '@vuelidate/core';
import {
  required, helpers, minLength, maxLength,
} from '@vuelidate/validators';
import axios from 'axios';

export default {
  name: 'EditCatBtn',

  props: {
    index: { type: Number },
    data: { type: Object },
  },

  data() {
    return {
      v$: useValidate(),
      id: NaN,
      name: '',
      editStatus: {
        success: false,
        fail: false,
      },
    };
  },

  validations() {
    return {
      name: {
        required: helpers.withMessage('This field cannot be empty!', required),
        minLength: minLength(5),
        maxLength: maxLength(70),
      },
    };
  },

  methods: {
    // Reset all method
    resetAll() {
      this.name = this.data.name;
      this.v$.$error = false;
    },

    // Edit record method
    async handleEdit(_catId) {
      const response = await axios.get(`http://localhost:3000/categories/${_catId}`);

      // If data is found (response returned)
      if (response.status === 200) {
        // Update the database with the new data
        await axios.put(`http://localhost:3000/categories/${_catId}`, {
          name: this.name,
          userId: this.data.userId,
          locId: this.data.locId,
        }).then((resp) => {
          // if changes are applied
          if (resp.status === 200) {
            // Set edit status alert (Success status)
            this.editStatus.success = true;

            // Reset edit status alert after 1.2s & reload the page
            setTimeout(() => {
              this.editStatus.success = true;
              window.location.reload();
            }, 1500);
          } else { // if something went wrong
            // Set edit status alert (Fail status)
            this.editStatus.fail = true;

            // Reset edit status alert after 1.2s
            setTimeout(() => {
              this.editStatus.fail = false;
            }, 1200);
          }
        });
      } else { // else not
        console.warn(new Error('Couldn\'t retrieve data!'));
      }
    },
  },

  mounted() {
    this.id = this.data.id;
    this.name = this.data.name;
  },
};
</script>
