<template lang="pug">
div
  <!-- Modal trigger button -->
  button(
    type="button",
    class="btn btn-danger ms-2",
    data-bs-toggle="modal",
    :data-bs-target="'#delRestModal' + index"
  ) Delete

  <!-- Modal -->
  div(
    class="modal fade",
    :id="'delRestModal' + index",
    tabindex="-1",
    :aria-labelledby="'delRestaurantModal' + index",
    data-bs-backdrop="static",
    data-bs-keyboard="false",
    aria-hidden="true",
  )
    div(class="modal-dialog modal-lg modal-dialog-scrollable")
      div(class="modal-content")

        div(class="modal-header")
          h5(class="modal-title", :id="'delRestaurantModal' + index")
            | Delete restaurant location
          button(type="button", class="btn-close", data-bs-dismiss="modal", aria-label="Close")

        div(class="modal-body d-flex flex-column justify-content-center align-items-center")
          h5(class="text-danger mb-4") Are you sure you wanna delete this location?
          div
            p #[strong ID:] {{ data.id }}
            p #[strong Name:] {{ data.name }}
            p #[strong Phone:] {{ data.phone }}
            p #[strong Address:] {{ data.address }}

          //- Alert
          main-alert(
            :toggleSuccess="deleleStatus.success",
            :toggleFail="deleleStatus.fail",
            :text="deleleStatus.success ? 'Operation done!' : 'Failed to perform operation!'"
          )

        div(class="modal-footer")
          button(
            type="button",
            class="btn btn-danger",
            @click="handleDelete(data.id)",
            :disabled="deleleStatus.success || deleleStatus.fail",
          ) Yes, Delete
          button(
            type="button",
            class="btn btn-secondary",
            data-bs-dismiss="modal"
          ) Cancel
</template>

<script>
import axios from 'axios';

export default {
  name: 'DeleteLocBtn',

  props: {
    index: { type: Number },
    data: { type: Object },
  },

  data() {
    return {
      deleleStatus: {
        success: false,
        fail: false,
      },
    };
  },

  methods: {
    // Delete record method
    async handleDelete(_restId) {
      await axios.delete(`http://localhost:3000/locations/${_restId}`).then((resp) => {
        /* If record is deleted */
        if (resp.status === 200) {
          // Update delete status (Success status)
          this.deleleStatus.success = true;

          // Reset to default after 1.2s
          setTimeout(() => {
            // Reset delete status
            this.deleleStatus.success = false;

            // Reload the page to apply changes
            window.location.reload();
          }, 1200);
        } else { /* If not deleted */
          // Update delete status (Fail status)
          this.deleleStatus.fail = true;

          setTimeout(() => {
            // Reset delete status
            this.deleleStatus.fail = false;
          }, 1200);
        }
      });
    },
  },
};
</script>
