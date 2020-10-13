<template>
  <!-- <div class="svg-icon"> -->
    <svg class="icon" aria-hidden="true">
      <use :xlink:href="'#'+iconName"></use>
    </svg>
  <!-- </div> -->
</template>
<script>
export default {
  props:{
    iconName:{
      type: String,
      require: true
    }
  },
  data() {
    return {
    }
  }
}
</script>
<style lang="scss" >
  .icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  }
</style>