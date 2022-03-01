<template>
  <div class='wrapper'>
    <div :class='{
      gameBox: true,
      showLeft: showing == "left",
      showRight: showing == "right",
      showCenter: showing == "center"
    }'>


      <div class='container-fluid aboveText'></div>
      <div class='container-fluid textBox'>
        <button @click='toggleShowing("left")'>left</button>
        <button @click='toggleShowing("center")'>center</button>
        <button @click='toggleShowing("right")'>right</button>
      </div>

    </div>
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
      if (window.innerWidth < 1000) this.showing = thing
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
  /* margin-top: 60px; */
}

@media (min-width: 1280px) {
  .gameBox {
    width: 1280px
  }
}

.wrapper {
  align-items: center;
  flex-direction: column;
  width: 100%;
  justify-items: center;
  display: flex;
}

.gameBox {
  width: 100vw;
  height: 100vh;
  max-width: calc(100vh * 16 / 10);
  max-height: 100vh;
  background-image: url('assets/bg.png');
  background-size: calc(100vh * 16 / 10) 100vh;
  /* background-size: 100% 100%; */
  background-repeat: no-repeat;
  border-style: solid;
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

.aboveText {
  height: 70%;
  border-style: solid;
  border-color: green;
}
.textBox {
  height: 30%;
  border-style: solid;
  border-color: greenyellow;
  background-image: url('assets/textbox.jpeg');
  background-position: left;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

</style>
