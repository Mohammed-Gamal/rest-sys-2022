<template lang="pug">
div
  <!-- Modal trigger button -->
  button(
    type="button",
    class="btn btn-primary me-2",
    data-bs-toggle="modal",
    :data-bs-target="'#EditRestModal' + index"
  ) Edit

  <!-- Modal -->
  div(
    class="modal fade",
    :id="'EditRestModal' + index",
    tabindex="-1",
    :aria-labelledby="'EditRestaurantModal' + index",
    data-bs-backdrop="static",
    data-bs-keyboard="false",
    aria-hidden="true",
  )
    div(class="modal-dialog modal-lg modal-dialog-scrollable")
      div(class="modal-content")

        div(class="modal-header")
          h5(class="modal-title", :id="'EditRestaurantModal' + index")
            | Edit restaurant location
          button(type="button", class="btn-close", data-bs-dismiss="modal", aria-label="Close")

        div(class="modal-body d-flex flex-column justify-content-center align-items-center")
          h5(class="text-danger mb-4") Are you sure you wanna apply these changes?
          //- ====================================================

          form(action="#", @submit.prevent novalidate)
            h3(class="text-center mb-4") Restaurant data
            div(class="row mb-3 gap-3 gap-md-0")
              div(class="mb-3 mx-auto w-75")
                input(
                  v-model.trim="name",
                  type="text",
                  name="name",
                  placeholder="Restaurant name",
                  class="form-control form-control-lg"
                )
                div(v-if="v$.name.$error", class="p-1 text-danger")
                  | {{    v$.name.$errors[0].$message    }}
              div(class="mb-3 mx-auto w-75")
                input(
                  v-model.trim="phone",
                  type="text",
                  name="phone",
                  placeholder="Phone number",
                  class="form-control form-control-lg"
                )
                div(v-if="v$.phone.$error", class="p-1 text-danger" )
                  | {{    v$.phone.$errors[0].$message    }}
              div(class="mx-auto w-75")
                input(
                  v-model.trim="address"
                  type="text",
                  name="address",
                  placeholder="Address",
                  class="form-control form-control-lg"
                  )
                div(v-if="v$.address.$error", class="p-1 text-danger" )
                  | {{    v$.address.$errors[0].$message    }}
                hr(class="hr")

              div(class="d-flex flex-column justify-content-center align-items-center gap-4 mt-5")
                button(
                  type="btn",
                  class="btn btn-secondary btn-lg px-md-5",
                  @click="resetAll()"
                ) Reset

                  //- Alert
                main-alert(
                  :toggleSuccess="editStatus.success",
                  :toggleFail="editStatus.fail",
                  :text="editStatus.success ? 'Operation done!' : 'Failed to perform operation!'"
                )

          //- ====================================================

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
            data-bs-dismiss="modal"
          ) Cancel
</template>

<script>
import useValidate from '@vuelidate/core';
import {
  required, helpers, minLength, maxLength,
} from '@vuelidate/validators';
import axios from 'axios';

export default {
  name: 'EditLocBtn',

  props: {
    index: { type: Number },
    data: { type: Object },
  },

  data() {
    return {
      v$: useValidate(),
      id: NaN,
      name: '',
      phone: '',
      address: '',
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
        maxLength: maxLength(100),
      },
      phone: {
        required: helpers.withMessage('This field cannot be empty!', required),
        minLength: minLength(11),
        maxLength: maxLength(40),
      },
      address: {
        required: helpers.withMessage('This field cannot be empty!', required),
        minLength: minLength(10),
        maxLength: maxLength(100),
      },
    };
  },

  methods: {
    // Reset all method
    resetAll() {
      this.name = this.data.name;
      this.phone = this.data.phone;
      this.address = this.data.address;
      this.v$.$error = false;
    },

    // Edit record method
    async handleEdit(_restId) {
      const response = await axios.get(`http://localhost:3000/locations/${_restId}`);

      // If data is found (response returned)
      if (response.status === 200) {
        // Update the database with the new data
        await axios.put(`
          http://localhost:3000/locations/${_restId}
        `, {
          userId: JSON.parse(localStorage.getItem('user-info')).id,
          name: this.name,
          phone: this.phone,
          address: this.address,
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
    this.phone = this.data.phone;
    this.address = this.data.address;
  },
};
</script>
