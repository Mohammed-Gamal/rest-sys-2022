<!-- eslint-disable max-len -->
<template lang="pug">
div
  <!-- Button trigger modal -->
  button(
    type="button",
    class="btn btn-outline-secondary pulseBtn",
    data-bs-toggle="modal",
    data-bs-target="#addCatModal"
  ) Add new category

  <!-- Modal -->
  div(
    class="modal fade",
    id="addCatModal",
    tabindex="-1",
    aria-labelledby="addCategoryModal1",
    aria-hidden="true"
  )
    div(class="modal-dialog modal-lg modal-dialog-scrollable")
      div(class="modal-content")

        div(class="modal-header")
          h5(class="modal-title", id="addCategoryModal1") Add a new category
          button(type="button", class="btn-close", data-bs-dismiss="modal", aria-label="Close")

        div(class="modal-body d-flex flex-column justify-content-center align-items-center")
          form(action="#", @submit.prevent novalidate)
            h3(class="text-center mb-4") Category required data
            div(class="row mb-3 gap-3 gap-md-0")
              div(class="mb-3 mx-auto w-75")
                div(class="form-floating")
                  input(
                    v-model.trim="name",
                    type="text",
                    name="name",
                    placeholder="Category name",
                    id="nameInputFloat",
                    class="form-control form-control-lg"
                  )
                  label(for="nameInputFloat") Category name
                  div(v-if="v$.name.$error", class="p-1 text-danger")
                    | {{ v$.name.$errors[0].$message }}
                hr(class="hr")

              div(class="d-flex flex-column justify-content-center align-items-center gap-4")
                button(
                  type="btn",
                  class="btn btn-secondary btn-lg px-md-5",
                  @click="resetAll()"
                  :disabled="operationState.success || operationState.fail"
                ) Reset

                //- Alert
                main-alert(
                  :toggleSuccess="operationState.success",
                  :toggleFail="operationState.fail",
                  :text="operationState.success ? 'Added data successfully!' : 'Something went wrong, try again!'"
                )

                main-alert(
                  :toggleFail="duplicated",
                  text="This category name already exists!"
                )

        div(class="modal-footer")
          button(
            type="button",
            class="btn btn-primary",
            @click="handleEdit()",
            :disabled="operationState.success || operationState.fail"
          ) Add now
          button(
            type="button",
            class="btn btn-secondary"
            data-bs-dismiss="modal",
            :disabled="operationState.success || operationState.fail"
          ) Close
</template>

<script>
import useValidate from '@vuelidate/core';
import {
  required, helpers, minLength, maxLength,
} from '@vuelidate/validators';
import axios from 'axios';
import MainAlert from '../Others/MainAlert.vue';

export default {
  name: 'AddCatBtn',

  components: {
    MainAlert,
  },

  props: {
    locId: { type: Number, default: NaN },
    userId: { type: Number, default: NaN },
  },

  data() {
    return {
      v$: useValidate(),
      name: '',
      operationState: {
        success: false,
        fail: false,
      },
      categoriesData: [],
      duplicated: false,
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
    resetAll() {
      this.name = '';
      this.v$.$error = false;
    },

    async handleEdit() {
      // Activate validation rules
      this.v$.$validate();

      // If form is validated
      if (!this.v$.$error) {
        // Get all user categories
        await axios.get(`
          http://localhost:3000/categories?userId=${this.userId}&locId=${this.locId}
        `).then((response) => {
          if (response.status === 200 && response.data.length) {
            this.categoriesData = response.data;
          } else {
            console.warn(new Error('Failed to retrieve categories data!'));
          }
        });

        this.categoriesData.forEach((cat) => {
          if (cat.name === this.name) this.duplicated = true;
        });

        if (!this.duplicated) {
          await axios.post('http://localhost:3000/categories', {
            name: this.name,
            userId: this.userId,
            locId: this.locId,
          }).then((response) => {
            if (response.status === 201) {
              // Show success message
              this.operationState.success = true;

              // Hide success message after a 1.5s delay
              setTimeout(() => {
                this.operationState.success = false;
                window.location.reload();
              }, 1500);
            } else {
              // Show fail message
              this.operationState.fail = true;

              // Hide fail message after a 1.2s delay
              setTimeout(() => {
                this.operationState.fail = false;
              }, 1200);
            }
          });
        } else {
          setTimeout(() => {
            this.duplicated = false;
          }, 1500);
        }
      } else console.warn(new Error('Failed to validate!')); // If form is not validated
    },
  },
};
</script>
