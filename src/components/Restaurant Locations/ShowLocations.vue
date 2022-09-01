<!-- eslint-disable no-multiple-empty-lines -->
<!-- eslint-disable max-len -->
<template lang="pug">
div
  div(class="d-flex justify-content-between")
    add-restaurant-loc

    // Search form
    div(v-if="data.length")
      form(class="d-flex justify-content-center align-items-center", role="search")
        input(
          v-model.trim="searchText",
          class="form-control me-2",
          type="search",
          placeholder="Search Locations...",
          aria-label="Search"
        )
        button(type="submit", class="btn search-btn", @click.prevent="handleSearch()")
          fa-icon(icon="fa-search")


  // Search results
  div(v-if="searchData.length", class="mt-5")
    div(aria-live="polite" aria-atomic="true" class="d-flex justify-content-center align-items-center w-100 mb-3")
      div(class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true")
        div(class="toast-header")
          svg(class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false")
            rect(width="100%" height="100%" fill="#007aff")

          strong(class="me-auto") Search results:
          small 1 result found!
          button(type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close")

        div(class="toast-body")
          p
            strong.me-2 Name:
            | {{ searchData[0].name }}
          p
            strong.me-2 Phone:
            | {{ searchData[0].phone }}
          p
            strong.me-2 Address:
            | {{ searchData[0].address }}

    main-alert(:toggleFail="searchFail", text="Couln't find any match!")


  div(class="mt-5 pb-3 fs-5")
    div(class="text-center text-secondary") List of all locations ({{ data.length }})
    delete-all-locs(v-if="data.length")

  div(class="overflow-x")
    table(
      v-if="data.length",
      class=`
      table
      table-striped
      table-hover
      table-responsive
      table-bordered
      mb-4
      shadow-sm
    `)
      thead(class="table-dark")
        tr
          th(scope="col") #
          th(scope="col") Name
          th(scope="col") Phone
          th(scope="col") Address
          th(scope="col") Actions
      tbody(class="align-middle")
        tr(v-for="(d, i) in data", :key="i")
          th(scope="row") {{   i + 1   }}
          td {{  d.name  }}
          td {{  d.phone  }}
          td {{  d.address  }}
          td
            div(class="d-flex justify-content-center align-items-center")
              div
                button(class="btn btn-dark me-3", @click="redirectToMenu(d.id)") Menu
              edit-loc-btn(
                :index="i",
                :data="d",
              )
              delete-loc-btn(
                :index="i",
                :data="d",
              )
    div(v-else)
      div(
        class="alert alert-warning alert-dismissible fade show text-center fs-5", role="alert")
        strong No data to show yet !
        button(type="button", class="btn-close", data-bs-dismiss="alert", aria-label="Close")
</template>

<script>
import axios from 'axios';
import MainAlert from '../Others/MainAlert.vue';
import AddRestaurantLoc from './AddRestaurantLoc.vue';
import DeleteAllLocs from './DeleteAllLocs.vue';
import EditLocBtn from './EditLocBtn.vue';
import DeleteLocBtn from './DeleteLocBtn.vue';

export default {
  name: 'ShowLocations',

  components: {
    MainAlert,
    DeleteAllLocs,
    AddRestaurantLoc,
    EditLocBtn,
    DeleteLocBtn,
  },

  props: {
    // obj: { type: Object, default: () => {} },
    data: { type: Array, default: () => [] },
  },

  data() {
    return {
      searchText: '',
      searchData: [],
      searchFail: false,
    };
  },

  methods: {
    // Search for a location method
    async handleSearch() {
      await axios.get(`
        http://localhost:3000/locations?name=${this.searchText}
      `).then((response) => {
        if (response.status === 200 && response.data.length) {
          this.searchData = response.data;
          this.searchText = '';
        } else {
          // Set search results flag
          this.searchFail = true;

          // Reset search results flag after 1.5s
          setTimeout(() => {
            this.searchFail = false;
          }, 1500);
        }
      });
    },

    // Edit record method
    async handleEdit(_restId) {
      await axios.put(`http://localhost:3000/locations/${_restId}`).then((resp) => {
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

    redirectToMenu(d) {
      this.$router.push({ name: 'menu', params: { locationId: d } });
    },
  },
};
</script>

<style lang="scss">
.search-btn {
  color: #a3773e !important;
  border: 1px solid #a3773e !important;

  &:hover {
    color: rgba(163, 119, 62, 0.5) !important;
    border-color: rgba(163, 119, 62, 0.5) !important;
  }
}
</style>
