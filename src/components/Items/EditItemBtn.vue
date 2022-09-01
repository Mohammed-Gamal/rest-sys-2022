<template lang="pug">
div
  <!-- Modal trigger button -->
  button(
    type="button",
    class="btn btn-primary px-4",
    data-bs-toggle="modal",
    :data-bs-target="'#EditItemModal' + index"
  ) Edit

  <!-- Modal -->
  div(
    class="modal fade",
    :id="'EditItemModal' + index",
    tabindex="-1",
    :aria-labelledby="'EditItemModal' + index",
    aria-hidden="true",
  )
    div(class="modal-dialog modal-lg modal-dialog-scrollable")
      div(class="modal-content")

        div(class="modal-header")
          h5(class="modal-title", :id="'EditItemModal' + index")
            | Edit Category
          button(type="button", class="btn-close", data-bs-dismiss="modal", aria-label="Close")

        div(class="modal-body d-flex flex-column justify-content-center align-items-center")
          h5(class="text-danger mb-4") Are you sure you wanna apply these changes?

          form(action="#", @submit.prevent novalidate)
            h3(class="text-center mb-4")
              | Item
              span.d-inline-block.ms-2.fst-italic.text-black-50.fs-5 '{{ itemName }}'
            div(class="row mb-3 gap-3 gap-md-0")
              div(class="mb-3 mx-auto w-75")
                div(class="form-floating")
                  input(
                    v-model.trim="itemName",
                    type="text",
                    name="name",
                    placeholder="Item Name",
                    id="nameInputFloat",
                    class="form-control form-control-lg"
                  )
                  label(for="nameInputFloat") Item Name
                  div(v-if="v$.itemName.$error", class="p-1 text-danger")
                    | {{ v$.itemName.$errors[0].$message }}

              div(class="mb-3 mx-auto w-75")
                div(
                  class=`
                    quantityCont
                    d-flex
                    flex-column
                    flex-md-row
                    justify-content-between
                    form-control
                    form-control-lg
                `)
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

              div(class="row mb-3 gap-3 gap-md-0")
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
                  :disabled="editStatus.success || editStatus.fail"
                ) Reset

                //- Alert
                main-alert(
                  :toggleSuccess="editStatus.success",
                  :toggleFail="editStatus.fail",
                  :text=`
                    editStatus.success
                      ? 'Successfully updated this item!'
                      : 'Could not update this item, try again!'
                  `)

                hr(class="hr")

        div(class="modal-footer")
          button(
            type="button",
            class="btn btn-warning",
            @click="handleEdit()",
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
  required, helpers, minLength, maxLength, minValue, maxValue,
} from '@vuelidate/validators';
import axios from 'axios';

export default {
  name: 'EditItemBtn',

  props: {
    index: { type: Number },
    data: { type: Object, default: () => {} },
    otherData: { type: Object, default: () => {} },
  },

  data() {
    return {
      v$: useValidate(),
      itemName: '',
      quantity: '',
      price: 0.0,
      description: '',
      editStatus: {
        success: false,
        fail: false,
      },
    };
  },

  validations() {
    return {
      itemName: {
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
        maxLength: maxLength(200),
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

    // Reset all method
    resetAll() {
      this.itemName = this.data.name;
      this.quantity = this.data.quantity;
      this.price = this.data.price;
      this.description = this.data.description;
      this.v$.$error = false;
    },

    // Edit record method
    async handleEdit() {
      const response = await axios.get(`http://localhost:3000/items?id=${this.data.id}`);

      // If item is found (response returned)
      if (response.status === 200) {
        // Update the database with the new data
        await axios.put(`http://localhost:3000/items/${this.data.id}`, {
          name: this.itemName,
          quantity: this.quantity,
          price: this.price,
          description: this.description,
          userId: this.otherData.userId,
          locId: parseInt(this.otherData.locId, 10),
          catId: this.otherData.catId,
        }).then((resp) => {
          // if changes are applied
          if (resp.status === 200) {
            // Set edit status alert (Success status)
            this.editStatus.success = true;

            // Reset edit status alert after 1.5s & reload the page
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
    this.itemName = this.data.name;
    this.quantity = this.data.quantity;
    this.price = this.data.price;
    this.description = this.data.description;
  },
};
</script>

<style lang="scss">
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
