<!-- eslint-disable max-len -->
<template lang="pug">
div
  <!-- Button trigger modal -->
  button(
    type="button",
    class="btn btn-secondary pulseBtn",
    data-bs-toggle="modal",
    data-bs-target="#addRestModal"
  ) Add new restaurant

  <!-- Modal -->
  div(
    class="modal fade",
    id="addRestModal",
    tabindex="-1",
    aria-labelledby="addRestaurantModal1",
    aria-hidden="true"
  )
    div(class="modal-dialog modal-fullscreen modal-dialog-scrollable")
      div(class="modal-content")

        div(class="modal-header")
          h5(class="modal-title", id="addRestaurantModal1") New restaurant location
          button(type="button", class="btn-close", data-bs-dismiss="modal", aria-label="Close")

        div(class="modal-body d-flex flex-column justify-content-center align-items-center")
          form(action="#", @submit.prevent novalidate)
            h3(class="text-center mb-4") Required data
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
                  | {{ v$.name.$errors[0].$message }}
              div(class="mb-3 mx-auto w-75")
                input(
                  v-model.trim="phone",
                  type="text",
                  name="phone",
                  placeholder="Phone number",
                  class="form-control form-control-lg"
                )
                div(v-if="v$.phone.$error", class="p-1 text-danger" )
                  | {{ v$.phone.$errors[0].$message }}
              div(class="mx-auto w-75")
                input(
                  v-model.trim="address"
                  type="text",
                  name="address",
                  placeholder="Address",
                  class="form-control form-control-lg"
                  )
                div(v-if="v$.address.$error", class="p-1 text-danger" )
                  | {{ v$.address.$errors[0].$message }}
                hr(class="hr")

              div(class="d-flex flex-column justify-content-center align-items-center mt-5 gap-4")
                button(
                  type="btn",
                  class="btn btn-secondary btn-lg px-md-5",
                  @click="resetAll()"
                ) Reset

                //- Alert
                main-alert(
                  :toggleSuccess="operationState.success",
                  :toggleFail="operationState.fail",
                  :text="operationState.success ? 'Added data successfully!' : 'Something went wrong, try again!'"
                )

        div(class="modal-footer")
          button(type="button", class="btn btn-primary px-5", @click="addLocation()") Add now
          button(type="button", class="btn btn-secondary px-4" data-bs-dismiss="modal") Close
</template>

<script>
import useValidate from '@vuelidate/core';
import {
  required, helpers, minLength, maxLength,
} from '@vuelidate/validators';
import axios from 'axios';

export default {
  name: 'AddRestaurantLoc',

  data() {
    return {
      v$: useValidate(),
      userId: NaN,
      name: '',
      phone: '',
      address: '',
      operationState: {
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
    resetAll() {
      this.name = '';
      this.phone = '';
      this.address = '';
      this.v$.$error = false;
    },

    async addLocation() {
      // Activate validation rules
      this.v$.$validate();

      if (!this.v$.$error) {
        console.log('Validated successfully!');

        const result = await axios.post('http://localhost:3000/locations', {
          userId: this.userId,
          name: this.name,
          phone: this.phone,
          address: this.address,
        });

        if (result.status === 201) {
          // Show success message
          this.operationState.success = true;

          // Hide success message after a 1s delay
          setTimeout(() => {
            this.operationState.success = false;
            window.location.reload();
          }, 2000);
        } else {
          this.operationState.fail = true;

          setTimeout(() => {
            this.operationState.fail = false;
          }, 1200);
        }
      } else console.log('Failed to validate!');
    },
  },

  mounted() {
    const user = JSON.parse(localStorage.getItem('user-info'));

    if (user) {
      this.userId = user.id;
    }
  },
};
</script>

<style lang="scss" scoped>
hr {
  margin: 0;
  margin-top: 2rem;
  border: 1px solid grey;
  padding: 0.5px;
}
</style>
