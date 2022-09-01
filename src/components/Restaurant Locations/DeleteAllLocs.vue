<!-- eslint-disable max-len -->
<template lang="pug">
div
  div(id="liveAlertPlaceholder", class="mb-4")
    button(
      type="button",
      id="liveAlertBtn",
      class="d-block ms-auto mt-4 mt-sm-0 btn btn-outline-danger",
      @click="deleteAll()"
    ) Delete All

  // Alert
  main-alert(
    :toggleSuccess="alertStatus.success",
    :toggleFail="alertStatus.fail",
    :text="alertStatus.success ? 'Successfully deleted all records!' : 'Oops, something went wrong!'"
  )
</template>

<script>
import axios from 'axios';

export default {
  name: 'DeleteAllLocs',

  data() {
    return {
      userId: NaN,
      alertStatus: {
        success: false,
        fail: false,
      },
    };
  },

  methods: {

    async deleteAll() {
      let IdsContainer = [];
      const resultsStatus = [];

      /* **  1) Handle restauarans' locations  ** */

      // Get locations ids
      await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}`,
      ).then((response) => {
        if (response.status === 200) {
          for (let i = 0; i < response.data.length; i += 1) {
            IdsContainer.push(response.data[i].id);
          }
        }
      });

      // Delete locations
      for (let i = 0; i < IdsContainer.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await axios.delete(
          `http://localhost:3000/locations/${IdsContainer[i]}`,
        ).then((response) => {
          if (response.status === 200) resultsStatus.push(true);
          else resultsStatus.push(false);
        });
      }

      /* **  2) Handle Categories  ** */

      // reset the IdsContainer object
      IdsContainer = [];

      // Get locations ids
      await axios.get(
        `http://localhost:3000/categories?userId=${this.userId}`,
      ).then((response) => {
        if (response.status === 200) {
          for (let i = 0; i < response.data.length; i += 1) {
            IdsContainer.push(response.data[i].id);
          }
        }
      });

      // Delete categories
      for (let i = 0; i < IdsContainer.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await axios.delete(
          `http://localhost:3000/categories/${IdsContainer[i]}`,
        ).then((response) => {
          if (response.status === 200) resultsStatus.push(true);
          else resultsStatus.push(false);
        });
      }

      /* **  3) Handle Items  ** */

      // Reset IdsContainer object
      IdsContainer = [];

      // Get items ids
      await axios.get(
        `http://localhost:3000/items?userId=${this.userId}`,
      ).then((response) => {
        if (response.status === 200) {
          for (let i = 0; i < response.data.length; i += 1) {
            IdsContainer.push(response.data[i].id);
          }
        }
      });

      // Delete items
      for (let i = 0; i < IdsContainer.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await axios.delete(
          `http://localhost:3000/items/${IdsContainer[i]}`,
        ).then((response) => {
          if (response.status === 200) resultsStatus.push(true);
          else resultsStatus.push(false);
        });
      }

      // Check if everything is done
      if (!resultsStatus.includes(false)) {
        console.log('All things are hopefully well!');

        // Set success status to true
        this.alertStatus.success = true;

        // Reset success status to default after 1.5s
        setTimeout(() => {
          this.alertStatus.success = false;

          // Reload the page to apply changes
          window.location.reload();
        }, 1500);
      } else { // if not?
        console.warn(new Error('Oops, looks like we\'ve run into a problem!'));

        // Set fail status to true
        this.alertStatus.fail = true;

        // Reset fail status to default after 1.5s
        setTimeout(() => {
          this.alertStatus.fail = false;
        }, 1500);
      }
    },
  },

  mounted() {
    // Get user id
    this.userId = JSON.parse(localStorage.getItem('user-info')).id;
  },
};
</script>
