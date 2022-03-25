<template>
  <div>
    <DialogueFrame v-bind:ui='ui' v-bind:images='images'
    v-bind:sections='sections' @select-option='onSelectOption' @set-flags='onSetFlags' @pass-progress='onEmitProgress'/>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import SHA256 from 'sha256-es';
import { setFlag } from './utils/flags'

import DialogueFrame from './frames/DialogueFrame.vue'

const PREFIX_SPRITE = './assets/sprites/'
const PREFIX_BG = './assets/backgrounds/'
const PREFIX_UI = './assets/interfaces/'
const PREFIX_SCRIPT = './assets/scripts/'

const GAME_NAME = "Project Persona"
const GAME_DEV = "mochipie95"

// const KEY_NICK_MC = 'morelle'

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

      // default new bookmark
      bookmark: {
        // identifier
        game_name: GAME_NAME,
        game_dev: GAME_DEV,
        game_hash : '',

        // reading progress
        current_section: '',
        current_scene: '',
        current_line: '',

        // auto generated
        auto: true,

        // divergence
        name: '',
        flags: [],
        choices: {}
      },

      // list of bookmarks in game (added everytime a new scene is reached, set name then)
      bookmarks: []
    }
  },
  provide() {
    return {
      // explicitly provide a computed property
      bookmark: computed(() => this.bookmark),
      bookmarks: computed(() => this.bookmarks)
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

    // load unique game has
    this.getGameHash()

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
    onEmitProgress(stuff) {
      this.bookmark.current_section = stuff.section
      this.bookmark.current_scene = stuff.scene
      this.bookmark.current_line = stuff.line
    },
    onSetFlags(stuff) {
      this.setFlags(stuff.flags)
    },
    onSelectOption(stuff) {
      console.log('selected: ' + stuff.option.name)
      this.bookmark.choices[stuff.section] = stuff.option
      // enact the flags
      this.setFlags(stuff.option.giving)
    },

    setFlags(flags) {
      // enact the flags
      for (var flag of flags) {
        this.bookmark.flags = setFlag(this.bookmark.flags, flag)
      }
      // console.log(this.bookmark.flags)
    },

    getGameHash() {
      var scriptString = ''
      for (var sect of this.sections) {
        scriptString += sect.meta__id
      }
      this.bookmark.game_hash = SHA256.hash(scriptString)
      console.log(this.bookmark.game_hash)

      // console.log(sha256.sync('hey there'))
    },
    // import all scripts here, add first section
    loadScripts() {
      const script1_1 = require(PREFIX_SCRIPT + 'scene 1.1.json')
      const script1_2 = require(PREFIX_SCRIPT + 'scene 1.2.json')
      
      // first eligible section will be played first, so order matters
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
