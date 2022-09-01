<template lang="pug">
div
  div(id="liveAlertPlaceholder", class="mb-4")
    button(
      type="button",
      id="liveAlertBtn",
      class="d-block ms-auto mt-4 mt-sm-0 btn btn-outline-danger",
      @click="deleteAll(data)"
    ) Delete All

  // Alert
  main-alert(
    :toggleSuccess="alertStatus.success",
    :toggleFail="alertStatus.fail",
    :text=`alertStatus.success ?
      'Successfully deleted all records!'
      : 'Oops, something went wrong!'
    `
  )
</template>

<script>
import axios from 'axios';
import MainAlert from '../Others/MainAlert.vue';

export default {
  name: 'DeleteAllCats',

  props: {
    data: { type: Array, default: () => [] },
  },

  components: {
    MainAlert,
  },

  data() {
    return {
      alertStatus: {
        success: false,
        fail: false,
      },
    };
  },

  methods: {

    async deleteAll(_data) {
      // Categories deletion status arrays
      const getCatStatus = [];
      const delCatStatus = [];

      // Get all user categories
      for (let i = 0; i < _data.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await axios.get(`
          http://localhost:3000/categories?id=${_data[i].id},
        `).then((response) => {
          if (response.status === 200) {
            getCatStatus.push(true);
          } else {
            getCatStatus.push(false);
          }
        });
      }

      // If categories data is found (response returned)
      if (!getCatStatus.includes(false)) {
        // Update the database
        for (let i = 0; i < _data.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await axios.delete(`
            http://localhost:3000/categories/${_data[i].id}
          `).then((resp) => {
            if (resp.status === 200) delCatStatus.push(true);
            else delCatStatus.push(false);
          });
        }

        // Categories deletion status arrays
        const itemsIds = [];
        const getItemStatus = [];
        const delItemStatus = [];

        // Get all user items related to its category
        for (let i = 0; i < _data.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await axios.get(`
            http://localhost:3000/items?catId=${_data[i].id}
          `).then((response) => {
            if (response.status === 200) {
              getItemStatus.push(true);
              itemsIds.push(response.data);
            } else getItemStatus.push(false);
          });
        }

        // If related items are found
        if (!getItemStatus.includes(false)) {
          // Loop over each item & delete it
          for (let i = 0; i < itemsIds.length; i += 1) {
            for (let j = 0; j < itemsIds[i].length; j += 1) {
              // eslint-disable-next-line no-await-in-loop
              await axios.delete(`
                http://localhost:3000/items/${itemsIds[i][j].id}
              `).then((resp) => {
                if (resp.status === 200) delItemStatus.push(true);
                else delItemStatus.push(false);
              });
            }
          }
        } else { // if not
          console.warn(new Error('Error deleting related items!'));
        }

        // if changes are applied
        if (!delCatStatus.includes(false) && !delItemStatus.includes(false)) {
          // Set status alert (Success status)
          this.alertStatus.success = true;

          // Reset status alert after 1.5s & reload the page
          setTimeout(() => {
            this.alertStatus.success = true;
            window.location.reload();
          }, 1500);
        } else { // if something went wrong
          // Set status alert (Fail status)
          this.alertStatus.fail = true;

          // Reset status alert after 1.2s
          setTimeout(() => {
            this.alertStatus.fail = false;
          }, 1200);
        }
      } else {
        console.warn(new Error('Something went wrong, please try again!'));
      }
    },
  },
};
</script>
