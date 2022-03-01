<template>
  <div :class='{
    "container-fluid": true,
    gameBox: true,
    showLeft: showing == "left",
    showRight: showing == "right",
    showCenter: showing == "center"
  }'>
    <button @click='toggleShowing("left")'>left</button>
    <button @click='toggleShowing("center")'>center</button>
    <button @click='toggleShowing("right")'>right</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showing: "left"
    }
  },
  methods: {
    toggleShowing(thing) {
      this.showing = thing
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.gameBox {
  width: 1280px;
  height: 800px;
  max-height: 800px;
  max-width: 1280px;
  background-image: url('assets/bg.png');
  background-repeat: no-repeat;
}

.showLeft {
  background-position: left;
}
.showRight {
  background-position: right;
}
.showCenter {
  background-position: center;
}
</style>
