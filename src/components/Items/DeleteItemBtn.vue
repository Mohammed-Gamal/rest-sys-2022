<template lang="pug">
div
  <!-- Modal trigger button -->
  button(
    type="button",
    class="btn btn-danger px-4",
    data-bs-toggle="modal",
    :data-bs-target="'#DeleteItemModal' + index"
  ) Delete

  <!-- Modal -->
  div(
    class="modal fade",
    :id="'DeleteItemModal' + index",
    tabindex="-1",
    :aria-labelledby="'DeleteItemModal' + index",
    aria-hidden="true",
  )
    div(class="modal-dialog modal-lg modal-dialog-scrollable")
      div(class="modal-content")

        div(class="modal-header")
          h5(class="modal-title", :id="'DeleteItemModal' + index")
            | Delete Item
          button(type="button", class="btn-close", data-bs-dismiss="modal", aria-label="Close")

        div(class="modal-body d-flex flex-column justify-content-center align-items-center")
          h4(class="text-danger mb-4")
            | Are you sure you wanna permanently delete this item?
          div
            p(class="fs-4 text-black-50")
              strong(class="text-black me-2") Item name:
              | {{ data.name }}
            p(class="fs-4 text-black-50")
              strong(class="text-black me-2") Quantity:
              | {{ data.quantity }}
            p(class="fs-4 text-black-50")
              strong(class="text-black me-2") Price:
              | ${{ data.price }}
            p(class="fs-4 text-black-50")
              strong(class="text-black me-2") Description:
              | {{ data.description }}
          hr(class="hr")

          //- Alert
          main-alert(
            :toggleSuccess="editStatus.success",
            :toggleFail="editStatus.fail",
            :text="editStatus.success ? 'Successfully deleted!' : 'Failed to delete item!'"
          )

        div(class="modal-footer")
          button(
            type="button",
            class="btn btn-danger",
            @click="handleDelete()",
            :disabled="editStatus.success || editStatus.fail",
          ) Yes, delete
          button(
            type="button",
            class="btn btn-secondary",
            data-bs-dismiss="modal",
            :disabled="editStatus.success || editStatus.fail",
          ) Cancel
</template>

<script>
import axios from 'axios';

export default {
  name: 'DeleteItemBtn',

  props: {
    index: { type: Number },
    data: { type: Object },
  },

  data() {
    return {
      editStatus: {
        success: false,
        fail: false,
      },
    };
  },

  methods: {
    // Delete category record method
    async handleDelete() {
      const statusFlag = [];

      // Get item
      const response = await axios.get(`http://localhost:3000/items/${this.data.id}`);

      // If data is found (response returned)
      if (response.status === 200) {
        // Update the database
        await axios.delete(`
          http://localhost:3000/items/${this.data.id}
        `).then((resp) => {
          // if changes are applied
          if (resp.status === 200) {
            // Set status flag
            statusFlag.push(true);
          } else { // if something went wrong
            // Set status flag
            statusFlag.push(false);
          }
        });
      } else {
        statusFlag.push(false);

        console.warn(new Error('Error, something went wrong during item deletion process!'));
      }

      // if changes are applied
      if (!statusFlag.includes(false)) {
        this.editStatus.success = true;

        // Reset status alert after 1.5s & reload the page
        setTimeout(() => {
          this.editStatus.success = true;
          window.location.reload();
        }, 1500);
      } else { // if something went wrong
        // Set status alert (Fail status)
        this.editStatus.fail = true;

        // Reset status alert after 1.2s
        setTimeout(() => {
          this.editStatus.fail = false;
        }, 1200);
      }
    },
  },

};
</script>
