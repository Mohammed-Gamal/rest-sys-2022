<template lang="pug">
div
  <!-- Modal trigger button -->
  button(
    type="button",
    class="btn btn-danger px-4",
    data-bs-toggle="modal",
    :data-bs-target="'#DeleteCatModal' + index"
  ) Delete

  <!-- Modal -->
  div(
    class="modal fade",
    :id="'DeleteCatModal' + index",
    tabindex="-1",
    :aria-labelledby="'DeleteCatModal' + index",
    aria-hidden="true",
  )
    div(class="modal-dialog modal-lg modal-dialog-scrollable")
      div(class="modal-content")

        div(class="modal-header")
          h5(class="modal-title", :id="'DeleteCatModal' + index")
            | Delete Category
          button(type="button", class="btn-close", data-bs-dismiss="modal", aria-label="Close")

        div(class="modal-body d-flex flex-column justify-content-center align-items-center")
          h5(class="text-danger mb-4")
            | Are you sure you wanna delete this category and its related items?
          div: p(class="fs-4") #[strong Category name:] {{ name }}
          hr(class="hr")

          //- Alert
          main-alert(
            :toggleSuccess="editStatus.success",
            :toggleFail="editStatus.fail",
            :text="editStatus.success ? 'Successfully deleted!' : 'Failed to perform operation!'"
          )

        div(class="modal-footer")
          button(
            type="button",
            class="btn btn-danger",
            @click="handleDelete(data.id)",
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
  name: 'DeleteCatBtn',

  props: {
    index: { type: Number },
    data: { type: Object },
  },

  data() {
    return {
      id: NaN,
      name: '',
      editStatus: {
        success: false,
        fail: false,
      },
    };
  },

  methods: {
    // Delete category record method
    async handleDelete(_catId) {
      const statusFlag = [];

      // Get category
      const response = await axios.get(`http://localhost:3000/categories/${_catId}`);

      // If data is found (response returned)
      if (response.status === 200) {
        // Update the database
        await axios.delete(`
          http://localhost:3000/categories/${_catId}
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

        // Get all user items related to its category
        const response2 = await axios.get(`http://localhost:3000/items?catId=${_catId}`);

        // If found
        if (response2.status === 200) {
          // Set status flag
          statusFlag.push(true);

          // Loop over each item & delete it
          for (let i = 0; i < response2.data.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await axios.delete(`
              http://localhost:3000/items/${response2.data[i].id}
            `).then((resp) => {
              if (resp.status === 200) statusFlag.push(true);
              else statusFlag.push(false);
            });
          }
        } else {
          // Set status flag
          statusFlag.push(false);

          console.warn(new Error('Error deleting related items!'));
        }
      } else {
        statusFlag.push(false);

        console.warn(new Error('Error, something went wrong!'));
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

  mounted() {
    this.id = this.data.id;
    this.name = this.data.name;
  },

};
</script>
