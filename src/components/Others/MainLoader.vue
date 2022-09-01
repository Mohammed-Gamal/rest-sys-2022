<template lang="pug">
div(
  class=`
    position-fixed
    start-0 top-0
    w-100 h-100
    bg-dark
    d-flex
    justify-content-center
    align-items-center
    `,
    style="--bs-bg-opacity: .5"
): div(class="spinner-border" role="status")
</template>

<script>
export default {
  name: 'MainLoader',
};
</script>
