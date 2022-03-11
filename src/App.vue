<template>
  <div class='wrapper'>
    <div :class='{
      gameBox: true,
      showLeft: showing == "left",
      showRight: showing == "right",
      showCenter: showing == "center"
    }'>

      <div class='container-fluid aboveText' :style="{ 
        backgroundImage: 'url(\'' + sprite.left + '\'), url(\'' + sprite.center + '\'), url(\'' + sprite.player + '\')'
       }">
        <button @click='toggleShowing("left")'>left</button>
        <button @click='toggleShowing("center")'>center</button>
        <button @click='toggleShowing("right")'>right</button>
        <button @click='restartScript()'>restart</button>
        <!-- {{ isLoaded() ? getCurrentScene().keyName : '' }} -->
      </div>
      <div class='container-fluid textBox' @click='advanceText()'>
          <p class='text-center speakerBox'>{{ isLoaded() ? getCurrentLine().speaker.name : 'no one' }}</p>
          <p class='text-start text-wrap text-break textingBox'>{{ isLoaded() ? getCurrentLine().text : 'nothing at all' }}</p>
      </div>

    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
const assetPref = './assets/'

export default {
  name: 'App',
  data() {
    return {
      showing: "left",
      showingText: "Jfdjnsfjsn is simply dummy text of the printing and typesetting industry. ejcnjsdn has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      speaker: 'hello',
      dialogue: {
        sceneName: null,
        lineName: null
      },
      canAdvance: false,
      sprite: {
        left: '',
        right: '',
        center: '',
        player: ''
      },
      images: {}
    }
  },
  setup() {
    var script = reactive({})
    return { script }
  },
  created() {
    this.script = require(assetPref + 'script.json');
    // set up positions
    for (var pos of this.script.meta__posList) {
      if (this.sprite[pos] == null) this.sprite[pos] = ''
    }

    // load image
    for (const [key, value] of Object.entries(this.script)) {
      if (key.startsWith('char__')) {
        for (var exp of value.expList) {
          this.images[value.keyName + "_" + exp] = require(assetPref + value.keyName + "_" + exp + ".png")
        }
      }
    }

    // restart script pointer
    this.restartScript()
  },
  methods: {
    restartScript() {
      // first scene
      this.dialogue.sceneName = this.script.meta__startName.slice(7)
      this.dialogue.lineName = this.getCurrentScene().meta__startName.slice(6)
      this.canAdvance = true
    },
    isLoaded() {
      return this.dialogue.sceneName && this.dialogue.lineName
    },
    getCurrentScene() {
      return this.script['scene__' + this.dialogue.sceneName]
    },
    getCurrentLine() {
      return this.script['scene__' + this.dialogue.sceneName]['line__' + this.dialogue.lineName]
    },
    advanceText() {
      if (this.isLoaded() && this.canAdvance) {
        // check if scene end
        if (this.getCurrentScene().meta__endName == 'line__' + this.dialogue.lineName || this.getCurrentLine().next == '') {
          // check if script end
          if (this.script.meta__endName == 'scene__' + this.dialogue.sceneName || this.getCurrentScene().next == '') {
            // end script
            this.canAdvance = false
          } else {
            // next scene
            this.dialogue.sceneName = this.getCurrentScene().next
            this.dialogue.lineName = this.getCurrentScene().meta__startName.slice(6)
          }
        } else {
          // next line
          this.dialogue.lineName = this.getCurrentLine().next
          this.loadSprite()
        }
      }
    },
    toggleShowing(thing) {
      if (window.innerWidth < 1000) this.showing = thing
    },
    loadSprite() {
      // clear display
      for (const [key1, value1] of Object.entries(this.sprite)) {
        value1
        this.sprite[key1] = ''
      }
      // load display
      var line = this.getCurrentLine()
      for (const [key, value] of Object.entries(line)) {
        if (key.startsWith('sprite__')) {
          // assume _ in between and png
          this.sprite[value.pos] = this.images[value.keyName + "_" + value.exp]
        }
      }
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
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
  /* background-image: url('assets/Morelle_dazed.png'),url('assets/Morelle_dazed.png'),url('assets/Morelle_dazed.png'); */
  background-size: contain,contain,contain;
  background-repeat: no-repeat,no-repeat,no-repeat;
  background-position: 5% 100%,center,95% 100%;
}
.textBox {
  height: 30%;
  border-style: solid;
  border-color: greenyellow;
  background-image: url('assets/textbox.jpeg');
  background-position: left;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: 3.5vmin;
}

.speakerBox {
  font-size: 3.5vmin;
  margin: 1vmin;
}
.textingBox {
  width: 100%;
  font-size: 3vmin;
  margin-left: 4vmin;
  padding-right: 5vmin;
}

</style>
