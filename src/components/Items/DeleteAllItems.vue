<template lang="pug">
button(
  type="button",
  class="d-block btn btn-outline-danger",
  @click="deleteAll()"
) Delete All

// Alert
main-alert(
  :toggleSuccess="alertStatus.success",
  :toggleFail="alertStatus.fail",
  :text=`alertStatus.success ?
    'Successfully deleted all items!'
    : 'Oops, something went wrong!'
  `
)
</template>

<script>
import axios from 'axios';
import MainAlert from '../Others/MainAlert.vue';

export default {
  name: 'DeleteAllItems',

  props: {
    data: { type: Object, default: () => {} },
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

    async deleteAll() {
      // Items deletion status arrays
      const getItemStatus = [];

      // Delete all user items (Method #1 - using passed items data)
      for (let i = 0; i < this.data.items.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await axios.delete(`
          http://localhost:3000/items/${this.data.items[i].id}
        `).then((response) => {
          if (response.status === 200) getItemStatus.push(true);
          else getItemStatus.push(false);
        });
      }

      /*
        // Delete all user items (Method #2 - using 'userId' & 'catId')
        const itemsIds = [];

        // Get all items ids depending on (userId & catId)
        await axios.get(`
          http://localhost:3000/items?userId=${this.data.userId}&catId=${this.data.catId}
        `).then((response) => {
          if (response.status === 200 && response.data.length) {
            // loop over each found item and push its id into itemsIds object
            for (let i = 0; i < response.data.length; i += 1) itemsIds.push(response.data[i].id);

            // Update success status
            getItemStatus.push(true);
          } else getItemStatus.push(false);
        });

        // Then, delete all items using itemsIds object
        for (let i = 0; i < itemsIds.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await axios.delete(`
            http://localhost:3000/items/${itemsIds[i]}
          `).then((response) => {
            if (response.status === 200) getItemStatus.push(true);
            else getItemStatus.push(false);
          });
        }
      */

      // If all items are deleted
      if (!getItemStatus.includes(false)) {
        // Set success alert status to 'true'
        this.alertStatus.success = true;

        // Reset success alert status
        setTimeout(() => {
          this.alertStatus.success = false;
          window.location.reload();
        }, 1200);
      } else { // If not
        // Set fail alert status to 'true'
        this.alertStatus.fail = true;

        // Reset fail alert status
        setTimeout(() => {
          this.alertStatus.fail = false;
        }, 1500);
      }
    },
  },
};
</script>
