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
.alert.alert-warning.alert-dismissible.fade.show.text-center.fs-5(role="alert")
  fa-icon.me-2(icon="fa-triangle-exclamation")
  strong You are now viewing category:
    p.d-inline-block.m-0.ms-2.text-black-50.fst-italic {{ categoryData.name }}
  button.btn-close(type="button" data-bs-dismiss="alert" aria-label="Close")
.d-flex.justify-content-center.align-items-center.gap-4.mt-5
  add-item-btn(:data=`{
      'userId': userId,
      'locId': locId,
      'catId': categoryData.id,
      'catName': categoryData.name
    }`)
  button.btn.btn-outline-secondary(type="button" @click="goBack()")
    | Go Back
div(class=`
  d-flex
  justify-content-between
  align-items-center
  flex-column
  flex-sm-row
  gap-4
  gap-sm-0
  mt-4
`)
  p(class="m-0 text-secondary fs-5")
    | All Items ({{ itemsData.length }})
  delete-all-items(:data=`{
    'userId': userId,
    'catId': categoryData.id,
    'items': itemsData
  }`)

div(class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 my-4")
  div(v-for="(item, i) in itemsData", :key="i", class="col")
    div(class="card h-100")
      h5(class="card-header py-3 text-center") {{ item.name }}
      div(class="card-body")
        h5(class="card-title m-0 mb-1 text-dark fw-bold fs-5") Description:
        p(class="card-text") {{ item.description }}

      ul(class="list-group list-group-flush")
        li(class="list-group-item")
          strong.me-2 Price:
          | ${{ numberWithCommas(item.price) }}
        li(class="list-group-item")
          strong.me-2 Quantity:
          | {{ numberWithCommas(item.quantity) }}
      div(class="card-footer d-flex justify-content-between")
        edit-item-btn(
          :index="i",
          :data="item",
          :otherData=`{
            'userId': userId,
            'locId': locId,
            'catId': categoryData.id
          }`
        )
        delete-item-btn(
          :index="i",
          :data="item"
        )

hr

div
  p.text-secondary.fs-5.text-center.mt-5 List of all items ({{ itemsData.length }})
  // If there are categories
  .overflow-x(v-if="itemsData.length")
    table(class=`
      table
      table-striped
      table-hover
      table-responsive
      table-bordered
      mb-5
      shadow-sm
    `)
      thead.table-dark
        tr.text-center
          th(scope="col")
            | #
          th(scope="col")
            | Item Name
          th(scope="col")
            | Quantity
          th(scope="col")
            | Price
          th(scope="col")
            | Description
          th(scope="col")
            | Actions
      tbody.align-middle
        tr(v-for="(item, i) in itemsData" :key="i")
          th(scope="row")
            .d-flex.justify-content-center.align-items-center {{ i + 1 }}
          td {{ item.name }}
          td.text-center {{ numberWithCommas(item.quantity) }}
          td.text-center ${{ numberWithCommas(item.price) }}
          td {{ item.description }}
          td
            .d-flex.justify-content-center.align-items-center.gap-3
              edit-item-btn(
                :index="i",
                :data="item",
                :otherData=`{
                  'userId': userId,
                  'locId': locId,
                  'catId': categoryData.id,
                }`
              )
              delete-item-btn(
                :index="i",
                :data="item",
              )
  // If not?
  div(v-else)
    .alert.alert-warning.alert-dismissible.fade.show.text-center.fs-5(role="alert")
      strong No data to show yet !
      button.btn-close(type="button" data-bs-dismiss="alert" aria-label="Close")
</template>

<script>
import axios from 'axios';
import AddItemBtn from '../components/Items/AddItemBtn.vue';
import EditItemBtn from '../components/Items/EditItemBtn.vue';
import DeleteItemBtn from '../components/Items/DeleteItemBtn.vue';
import DeleteAllItems from '../components/Items/DeleteAllItems.vue';

export default {
  name: 'ItemView',

  components: {
    AddItemBtn,
    EditItemBtn,
    DeleteItemBtn,
    DeleteAllItems,
  },

  data() {
    return {
      userId: NaN,
      locId: NaN,
      catId: NaN,
      categoryData: {},
      itemsData: '',
      locData: {
        name: '',
        address: '',
        phone: '',
      },
    };
  },

  methods: {
    goBack() {
      this.$router.push({ name: 'menu' });
    },

    numberWithCommas(n) {
      return n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    },
  },

  async mounted() {
    const user = localStorage.getItem('user-info');

    if (!user) {
      this.$router.push({ name: 'login' });
    } else {
      this.userId = JSON.parse(user).id;
      this.locId = this.$route.params.locationId;
      this.catId = this.$route.params.catId;

      // Get restaurant location data
      await axios.get(`
        http://localhost:3000/locations?userId=${this.userId}&id=${this.locId}
      `).then((response) => {
        if (response.status === 200 && response.data.length) {
          this.locData.name = response.data[0].name;
          this.locData.phone = response.data[0].phone;
          this.locData.address = response.data[0].address;
        } else {
          console.error(new Error('Couldn\'t retrieve data!'));
        }
      });

      // Get category data
      await axios.get(`
        http://localhost:3000/categories?id=${this.catId}
      `).then((response) => {
        if (response.status === 200 && response.data.length) {
          // eslint-disable-next-line prefer-destructuring
          this.categoryData = response.data[0];
        } else {
          console.warn(new Error('Failed to retrieve categories data!'));
        }
      });

      // Get items data
      await axios.get(`
        http://localhost:3000/items?userId=${this.userId}&locId=${this.locId}&catId=${this.catId}
      `).then((response) => {
        if (response.status === 200 && response.data.length) {
          this.itemsData = response.data;
        } else {
          console.warn(new Error('Failed to retrieve items data!'));
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
small a:hover {
  color: rgba(0, 0, 0, 0.5) !important;
  opacity: 0.8;
}
</style>
