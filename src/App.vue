<template>
  <div>
    <DialogueFrame v-bind:ui='ui' v-bind:images='images'
    v-bind:sections='sections' />
  </div>
</template>

<script>
import { reactive } from 'vue'
import DialogueFrame from './frames/DialogueFrame.vue'

const PREFIX_SPRITE = './assets/sprites/'
const PREFIX_BG = './assets/backgrounds/'
const PREFIX_UI = './assets/interfaces/'
const PREFIX_SCRIPT = './assets/scripts/'

export default {
  name: 'App',
  components: {
    DialogueFrame
  },
  data() {
    return {
      ui: {
        textbox: ''
      },
      images: {},
    }
  },
  setup() {
    var sections = reactive([])
    return { sections }
  },
  created() {
    this.loadScripts()
    // set up positions
    // for (var pos of this.script.meta__posList) {
    //   if (this.sprite[pos] == null) this.sprite[pos] = ''
    // }

    // load interfaces
    this.ui.textbox = require(PREFIX_UI + 'textbox.jpeg')

    // default sprite
    const defaultImg = require(PREFIX_SPRITE + 'default.png')

    for (var sect of this.sections) {
      // load character sprites
      for (const [key, value] of Object.entries(sect)) {
        if (key.startsWith('char__')) {
          for (var exp of value.expList) {
            try {
              this.images[value.keyName + "_" + exp] = require(PREFIX_SPRITE + value.keyName + "_" + exp + ".png")
            } catch(e) {
              this.images[value.keyName + "_" + exp] = defaultImg
            }
          }
        }
      }

      // load background
      for (var bg of sect.meta__bgList) {
        if (bg != 'none') this.images['bg_' + bg] = require(PREFIX_BG + 'bg_' + bg + '.png')
      }

    }

  },
  methods: {
    // import all scripts here, add first section
    loadScripts() {
      const script1_1 = require(PREFIX_SCRIPT + 'scene 1.1.json')
      const script1_2 = require(PREFIX_SCRIPT + 'scene 1.2.json')
      
      this.sections.push(script1_1)
      this.sections.push(script1_2)
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
</style>
