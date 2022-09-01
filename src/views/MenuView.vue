<!-- eslint-disable max-len -->
<template lang="pug">
.bd-callout.bd-callout-info.ps-5.text-black-50.fs-6
  h4.fw-bold
    fa-icon.me-2(icon="fa-comment")
    | Restraurant Info:
  p.m-0.mb-1.mt-3
    strong Name:
    |  {{ locData.name }}
  p.m-0.mb-1
    strong Phone:
    |  {{ locData.phone }}
  p.m-0
    strong Address:
    |  {{ locData.address }}
.d-flex.justify-content-center.align-items-center.gap-4.mt-5
  add-cat-btn(:data="categoriesData" :locId="parseInt(locId)" :userId="userId")
  button.btn.btn-outline-secondary(@click="redirectToHome()")
    | Go back to restaruants list
div
  p.text-secondary.fs-5.text-center.mt-5 List of all categories ({{ categoriesData.length }})
    delete-all-cats(:data="categoriesData")
  // If there are categories
  .overflow-x(v-if="categoriesData.length")
    table(class=`
      table
      table-striped
      table-hover
      table-responsive
      table-bordered
      mb-4
      shadow-sm
    `)
      thead.table-dark
        tr.text-center
          th(scope="col")
            | #
          th(scope="col")
            | Category Name
          th(scope="col")
            | Actions
      tbody.align-middle
        tr(v-for="(cat, i) in categoriesData" :key="i")
          th(scope="row")
            .d-flex.justify-content-center.align-items-center {{ i + 1 }}
          td {{  cat.name  }}
          td
            .d-flex.justify-content-center.align-items-center.gap-3
              div
                button.btn.btn-secondary.px-4(@click="redirectToView(cat.id)")
                  | View
              edit-cat-btn(:index="i" :data="cat")
              delete-cat-btn(:index="i" :data="cat")
  // If not?
  div(v-else)
    .alert.alert-warning.alert-dismissible.fade.show.text-center.fs-5(role="alert")
      strong No data to show yet !
      button.btn-close(type="button" data-bs-dismiss="alert" aria-label="Close")
</template>

<script>
import axios from 'axios';
import AddCatBtn from '../components/Categories/AddCatBtn.vue';
import EditCatBtn from '../components/Categories/EditCatBtn.vue';
import DeleteCatBtn from '../components/Categories/DeleteCatBtn.vue';
import DeleteAllCats from '../components/Categories/DeleteAllCats.vue';

export default {
  name: 'MenuView',

  components: {
    AddCatBtn,
    EditCatBtn,
    DeleteCatBtn,
    DeleteAllCats,
  },

  data() {
    return {
      userId: NaN,
      locId: NaN,
      categoriesData: [],
      locData: {
        name: '',
        address: '',
        phone: '',
      },
    };
  },

  methods: {
    redirectToView(_catId) {
      this.$router.push({
        name: 'view item',
        params: { locationId: this.locId, catId: _catId },
      });
    },
    redirectToHome() {
      this.$router.push({ name: 'home' });
    },
  },

  async mounted() {
    const user = localStorage.getItem('user-info');

    if (!user) {
      this.$router.push({ name: 'login' });
    } else {
      this.userId = JSON.parse(user).id;
      this.locId = this.$route.params.locationId;

      // Get category data
      await axios.get(`
        http://localhost:3000/categories?userId=${this.userId}&locId=${this.locId}
      `).then((response) => {
        if (response.status === 200 && response.data.length) {
          this.categoriesData = response.data;
        } else {
          console.warn(new Error('Failed to retrieve categories data!'));
        }
      });

      // Get restaurant location data
      await axios.get(`
        http://localhost:3000/locations?userId=${this.userId}&id=${this.locId}
      `).then((response) => {
        if (response.status === 200 && response.data.length) {
          // this.locData = response.data;
          this.locData.name = response.data[0].name;
          this.locData.phone = response.data[0].phone;
          this.locData.address = response.data[0].address;
        } else {
          console.error(new Error('Couldn\'t retrieve data!'));
        }
      });
    }
  },
};
</script>

<style lang="scss">
.bd-callout-info {
  --bd-callout-bg: rgba(var(--bs-info-rgb), .075);
  --bd-callout-border: rgba(var(--bs-info-rgb), .5);
}

.bd-callout {
  padding: 1.25rem;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  background-color: var(--bd-callout-bg, var(--bs-gray-100));
  border-left: 0.25rem solid var(--bd-callout-border, var(--bs-gray-300));
}
</style>
