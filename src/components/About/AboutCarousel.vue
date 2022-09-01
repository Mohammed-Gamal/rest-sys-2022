<!-- eslint-disable max-len -->
<template lang="pug">
div(
  id="slider-carousel",
  class="carousel slide carousel-fade pb-2 mt-5",
  data-bs-interval="5000",
  data-bs-ride="carousel"
)
  div(class="carousel-indicators rounded gap-2")
    button(
      v-for="index in items.length",
      :key="index",
      type="button",
      data-bs-target="#slider-carousel",
      :data-bs-slide-to="index-1",
      :class="{ 'active': index === 1}",
      aria-current="true",
      :aria-label="`Slide ${index}`"
    )

  div(class="carousel-inner")
    div(
      v-for="(item, index) in items",
      :class=`{
        'carousel-item': true,
        'active': index === 1
      }`
    )
      div(class="slide-img rounded-4 overflow-hidden mb-5 mx-auto")
        img(
          class="img-fluid",
          :src="require(`../../assets/${item.imgName}`)",
          alt="Image")
      div(class="carousel-caption d-none d-md-block rounded-bottom")
        h5 {{ item.title }}
        p {{ item.text }}

  button(class="carousel-control-prev", type="button", data-bs-target="#slider-carousel", data-bs-slide="prev")
    span(class="fs-1", aria-hidden="true"): fa-icon(icon="fa-angle-left")
    span(class="visually-hidden") Previous

  button(class="carousel-control-next", type="button", data-bs-target="#slider-carousel" data-bs-slide="next")
    span(class="fs-1", aria-hidden="true"): fa-icon(icon="fa-angle-right")
    span(class="visually-hidden") Next
</template>

<script>
export default {
  name: 'AboutCarousel',

  props: {
    items: { type: Array, default: () => [] },
  },
};
</script>

<style lang="scss">
.slide-img {
  height: 370px;
  img {
    width: 100% !important;
    height: 100% !important;
  }
}

.carousel-indicators {
  [data-bs-target] {
    width: 20px !important;
    height: 20px !important;
    border-radius: 50% !important;
    margin: 0 !important;
    border: 0 !important;
    background-color: rgba(0,0,0,0.5) !important;
  }
}

.carousel-caption {
  right: 0 !important;
  left: 0 !important;
  bottom: 3rem !important;
  background-color: rgba(163, 119, 62, 0.7) !important;
}

[class*=fa-angle] {
  color: #ff9000;
}
</style>
