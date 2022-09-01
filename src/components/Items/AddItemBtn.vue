<!-- eslint-disable max-len -->
<template lang="pug">
div
  <!-- Button trigger modal -->
  button(
    type="button",
    class="btn btn-outline-secondary pulseBtn"
    data-bs-toggle="modal",
    data-bs-target="#addItemModal"
  ) Add new item

  <!-- Modal -->
  div(
    class="modal fade",
    id="addItemModal",
    tabindex="-1",
    aria-labelledby="addItemModal1",
    aria-hidden="true"
  )
    div(class="modal-dialog modal-lg modal-dialog-scrollable")
      div(class="modal-content")

        div(class="modal-header")
          h5(class="modal-title", id="addItemModal1")
            | Add a new item to
            span(class="d-inline-block mx-1 fst-italic")
              | '{{ data.catName }}'
            |  category
          button(type="button", class="btn-close", data-bs-dismiss="modal", aria-label="Close")

        div(class="modal-body")
          form(action="#", @submit.prevent novalidate)
            h3(class="text-center mb-4") Required item data
            div(class="row mb-3 gap-3 gap-md-0")
              div(class="mb-3 mx-auto w-75")
                div(class="form-floating")
                  input(
                    v-model.trim="ItemName",
                    type="text",
                    name="name",
                    placeholder="Item name",
                    id="nameInputFloat",
                    class="form-control form-control-lg"
                  )
                  label(for="nameInputFloat") Item name
                  div(v-if="v$.ItemName.$error", class="p-1 text-danger")
                    | {{ v$.ItemName.$errors[0].$message }}

              div(class="mb-3 mx-auto w-75")
                div(class=" quantityCont d-flex flex-column flex-md-row justify-content-between form-control form-control-lg")
                  button(
                    class="btn btn-dark px-3",
                    @click="{quantity: quantity == 0 ? 0 : quantity--}"
                  ) -
                  input(
                    v-model="quantity",
                    type="text",
                    name="quantity",
                    id="quantityInput",
                    class="border-0 flex-fill my-3 my-md-0",
                    @focus="focusInput()"
                    @blur="blurInput()"
                  )
                  button(
                    class="btn btn-dark px-3",
                    @click="quantity++"
                  ) +
                div(v-if="v$.quantity.$error", class="p-1 text-danger")
                  | {{ v$.quantity.$errors[0].$message }}

              div(class="mb-3 mx-auto w-75")
                div(class="form-floating")
                  input(
                    v-model.trim="price",
                    type="number",
                    name="price",
                    placeholder="Item Price",
                    id="priceInputFloat",
                    class="form-control form-control-lg"
                  )
                  label(for="priceInputFloat") Price
                  div(v-if="v$.price.$error", class="p-1 text-danger")
                    | {{ v$.price.$errors[0].$message }}

              div(class="mb-3 mx-auto w-75")
                div(class="form-floating")
                  textarea(
                    v-model.trim="description",
                    name="description",
                    placeholder="Description",
                    id="descriptionInput",
                    class="form-control form-control-lg"
                  )
                  label(for="descriptionInput") Description
                  div(v-if="v$.description.$error", class="p-1 text-danger")
                    | {{ v$.description.$errors[0].$message }}
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
                  text="This item name already exists!"
                )

        div(class="modal-footer")
          button(
            type="button",
            class="btn btn-primary",
            @click="addItem()",
            :disabled="operationState.success || operationState.fail"
          ) Register this item
          button(
            type="button",
            class="btn btn-secondary"
            data-bs-dismiss="modal",
            :disabled="operationState.success || operationState.fail"
          ) Cancel
</template>

<script>
import useValidate from '@vuelidate/core';
import {
  required, helpers, minLength, maxLength, minValue, maxValue,
} from '@vuelidate/validators';
import axios from 'axios';
import MainAlert from '../Others/MainAlert.vue';

export default {
  name: 'AddItemBtn',

  components: {
    MainAlert,
  },

  props: {
    data: { type: Object, default: () => {} },
  },

  data() {
    return {
      v$: useValidate(),
      ItemName: '',
      quantity: 0,
      price: 0.0,
      description: '',
      allItems: [],
      operationState: {
        success: false,
        fail: false,
      },
      duplicated: false,
    };
  },

  validations() {
    return {
      ItemName: {
        required: helpers.withMessage('This field cannot be empty!', required),
        minLength: minLength(5),
        maxLength: maxLength(70),
      },
      quantity: {
        required: helpers.withMessage('This field cannot be empty!', required),
        minValue: minValue(1),
        maxValue: maxValue(99999),
      },
      price: {
        required: helpers.withMessage('This field cannot be empty!', required),
        minValue: minValue(1),
        maxValue: maxValue(99999),
      },
      description: {
        required: helpers.withMessage('This field cannot be empty!', required),
        minLength: minLength(7),
        maxLength: maxLength(300),
      },
    };
  },

  methods: {
    focusInput() {
      document.getElementById('quantityInput').style.textIndent = '10%';
    },

    blurInput() {
      document.getElementById('quantityInput').style.textIndent = '50%';
    },

    resetAll() {
      this.ItemName = '';
      this.quantity = 0;
      this.price = 0.0;
      this.description = '';
      this.v$.$error = false;
    },

    async addItem() {
      // Activate validation rules
      this.v$.$validate();

      // If form is validated
      if (!this.v$.$error) {
        // Check if the item name is duplicated
        await axios.get(`
          http://localhost:3000/items?catId=${this.data.catId}
        `).then((response) => {
          if (response.status === 200) {
            this.allItems = response.data;
          } else {
            console.warn(new Error('Couldn\'t find any items!'));
          }
        });

        this.allItems.forEach((item) => {
          if (item.name === this.ItemName) this.duplicated = true;
        });

        // If there are no duplicates
        if (!this.duplicated) {
          // Add the new item
          await axios.post('http://localhost:3000/items', {
            name: this.ItemName,
            quantity: this.quantity,
            price: this.price,
            description: this.description,
            userId: this.data.userId,
            locId: this.data.locId,
            catId: this.data.catId,
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
              this.operationState.success = false;

              // Hide fail message after a 1.2s delay
              setTimeout(() => {
                this.operationState.fail = false;
              }, 1200);
              console.warn(new Error('Failed to add this item data!'));
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

<style lang="scss" scoped>
@import "../../sass/_variables.scss";

#descriptionInput {
  min-height: 200px;
}

#quantityInput {
  display: inline-block;
  outline: none;
  transition: $trans;
  text-indent: 50%;
}

.quantityCont {
  position: relative;

  &:before {
    content: "Quantity";
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    opacity: .3;
    font-size: 0.8rem;
  }
}
</style>
