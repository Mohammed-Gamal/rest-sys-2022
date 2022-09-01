<!-- eslint-disable max-len -->
<template lang="pug">
div(class=`
  main
  w-75
  mx-auto
  mt-5
  mb-5
  d-flex
  flex-column
  justify-content-center
  align-items-center
`)
  h2(class="our-story fw-bold fs-1") Our Story
  p(class="story-text m-0 mt-4 mb-5")
    | Embracing the sublime pleasure of drink, the joy of good food and the comfort of family – Pourhouse is the embodiment of a passion for sharing the simple indulgences of life with friends. Just southeast of the steam clock in Gastown, Pourhouse harkens back to century-old styles of drinking and dining. The 100-year-old building was built in 1910, as home to the Leckie Boot Company – the original structure crafted with Douglas fir ceilings, supported by large wood pillars, and brick walls. Pourhouse is furnished in antiques of the era – complemented by custom creations. Every piece in Pourhouse has a story. The cornerstone is the 38 ft. bar – lovingly handcrafted from 120 year-old planks of reclaimed Douglas fir. Entrance and hallway walls are finished with era-inspired textures and gold leaf detailing – no aesthetic left unconsidered.
  button(type="button", class="btn btn-outline-secondary w-50 py-2") Read More

hr(class="mt-3")

// Slider
about-carousel(:items="items")
</template>

<script>
import AboutCarousel from '../components/About/AboutCarousel.vue';

export default {
  name: 'AboutView',

  components: {
    AboutCarousel,
  },

  data() {
    return {
      items: [
        {
          imgName: 'food-01.jpg',
          title: 'First slide label',
          text: 'Some representative placeholder content for the first slide.',
        },
        {
          imgName: 'food-02.jpg',
          title: 'Second slide label',
          text: 'Some representative placeholder content for the second slide.',
        },
        {
          imgName: 'food-03.jpg',
          title: 'Third slide label',
          text: 'Some representative placeholder content for the third slide.',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.main {
  border: 1px solid #a92839;
  border-image: url("@/assets/about01.svg");
  border-image-slice: 0 12%;
  border-image-width: 0 12%;

  .our-story {
    color: #a92839;
    padding-bottom: 0.5rem;

    &::after {
      content: url("@/assets/about02.svg");
      display: block;
      width: 100%;
      margin: {
        top: -0.7rem;
        right: auto;
        left: auto;
      }
    }
  }

  .story-text {
    width: 78%;
    text-align: justify;
  }
}
</style>
