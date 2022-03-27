<template>
  <div>
    <!-- main frame -->
    <TitleFrame v-if='isOfFrame("title")' @quick-link='onQuickLink'/>
    <DialogueFrame v-if='isOfFrame("dialogue")' v-bind:ui='ui' v-bind:images='images'
    v-bind:sections='sections' @select-option='onSelectOption' @set-flags='onSetFlags' @pass-progress='onEmitProgress' :key='toggleReload'/>

    <!-- side menu for navigation -->
    <div class='position-absolute top-50 start-0'>
      <img class='mx-3  ' src='./assets/interfaces/button_openmodal.png' type="button" data-bs-toggle="offcanvas" data-bs-target="#sideMenu" aria-controls="sideMenu"/>
      <!-- <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#sideMenu" aria-controls="sideMenu">
        Button with data-bs-target
      </button> -->
    </div>


    <div class="offcanvas offcanvas-start bg-black" tabindex="-1" id="sideMenu" aria-labelledby="sideMenuLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="sideMenuLabel">{{ bookmark.game_name }}</h5>
        <button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ActionButton v-bind:actionType='getButtonActionType()' />
        <button type="button" class="btn btn-warning" @click='onRestartGame()'>Restart</button>
        <!-- <div class="dropdown mt-3">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
            Dropdown button
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import SHA256 from 'sha256-es';
import { setFlag } from './utils/flags'

import DialogueFrame from './frames/DialogueFrame.vue'
import TitleFrame from './frames/TitleFrame.vue'
import ActionButton from './components/ActionButton.vue'

const PREFIX_SPRITE = './assets/sprites/'
const PREFIX_BG = './assets/backgrounds/'
const PREFIX_UI = './assets/interfaces/'
const PREFIX_SCRIPT = './assets/scripts/'

const GAME_NAME = "Project Persona"
const GAME_DEV = "mochipie95"

const FRAME_TITLE = 'TITLE FRAME'
const FRAME_DIALOGUE = "DIALOGUE FRAME"
// const FRAME_FLOWCHART = "FLOWCHART FRAME"
// const FRAME_PROFILE = "PROFILE FRAME"

// const KEY_NICK_MC = 'morelle'

export default {
  name: 'App',
  components: {
    DialogueFrame,
    TitleFrame,
    ActionButton
  },
  data() {
    return {
      frame: FRAME_TITLE,
      toggleReload: false,
      ui: {
        textbox: ''
      },
      images: {},

      // default new bookmark
      bookmark: {},
      game_hash: '',

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

    // create unique game hash
    this.getGameHash()
    // create new bookmark
    this.restartBookmark()

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
    reloadDialogue() {
      this.toggleReload = !this.toggleReload
    },
    isOfFrame(frameStr) {
      if (frameStr == "dialogue") return this.getCurrentFrame() == FRAME_DIALOGUE
      else if (frameStr == "title") return this.getCurrentFrame() == FRAME_TITLE
      return false
    },
    switchFrame(frameStr) {
      if (frameStr == "dialogue") this.frame = FRAME_DIALOGUE
      else if (frameStr == "title") this.frame = FRAME_TITLE
    },
    getCurrentFrame() {
      return this.frame;
    },
    getButtonActionType() {
      if (this.isOfFrame('dialogue')) return "save"
      else if (this.isOfFrame('title')) return "load"
      return "none"
    },
    
    onRestartGame() {
        // to dialogue frame, new game
        this.restartBookmark()
        this.reloadDialogue()
        this.switchFrame("dialogue")
        console.log(this.bookmark.flags)
    },
    onQuickLink(linkStr) {
      if (linkStr == "start") {
        this.onRestartGame()
      } else if (linkStr == "load") {
        // to load modal
      }
    },
    onEmitProgress(stuff) {
      this.bookmark.current_section = stuff.section
      this.bookmark.current_scene = stuff.scene
      this.bookmark.current_line = stuff.line
      // console.log(this.bookmark.flags)
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
      this.game_hash = SHA256.hash(scriptString)
      console.log(this.game_hash)

      // console.log(sha256.sync('hey there'))
    },

    // restart bookmark
    restartBookmark() {
      // default new bookmark
      this.bookmark = {
        // identifier
        game_name: GAME_NAME,
        game_dev: GAME_DEV,
        game_hash : this.game_hash,

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
      }
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
  /* background-image: url('assets/bg.png'); */
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
</style>
