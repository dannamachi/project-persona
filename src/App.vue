<template>
  <div>
    <!-- main frame -->
    <CreditFrame v-if='isOfFrame("credit")' @return-title='switchFrame("title")'/>
    <StartFrame v-if='isOfFrame("start")' @start-game='switchFrame("title")'/>
    <ProfileFrame v-if='isOfFrame("profile")' @name-change='onUpdateName' v-bind:toggleSuccess='nameChangeSuccess' v-bind:toggleError='nameChangeError' v-bind:playerName='getPlayerNameObject()' @empty-alert='nameChangeSuccess = false; nameChangeError = true'/>
    <TitleFrame v-if='isOfFrame("title")' @quick-link='onQuickLink'/>
    <DialogueFrame v-show='isOfFrame("dialogue")' v-bind:ui='ui' v-bind:images='images'
    v-bind:sections='sections' @select-option='onSelectOption' @pass-progress='onEmitProgress' :key='toggleDialogue'
    @to-next-scene='onNextScene' @to-next-line='onNextLine' @to-next-section='onNextSection'/>

    <!-- button to side menu-->
    <div v-if='!isOfFrame("start") && !isOfFrame("credit")' class='position-absolute top-50 start-0'>
      <img class='mx-3  ' src='./assets/interfaces/button_openmodal.png' type="button" data-bs-toggle="offcanvas" data-bs-target="#sideMenu" aria-controls="sideMenu"/>
      <!-- <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#sideMenu" aria-controls="sideMenu">
        Button with data-bs-target
      </button> -->
    </div>

    <!-- side menu -->
    <div class="offcanvas offcanvas-start bg-black" tabindex="-1" id="sideMenu" aria-labelledby="sideMenuLabel" :key='toggleSideMenu'>
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="sideMenuLabel">{{ bookmark.game_name }}</h5>
        <button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <!-- screen specific action button -->
        <ActionButton v-bind:actionType='getButtonActionType()' @set-bookmark='onSetBookmark'/>
        <!-- restart button -->
        <button type="button" class="mt-2 mb-2 btn btn-warning" data-bs-dismiss="offcanvas" @click='onRestartGame()'>Restart</button>
        <!-- load button -->
        <div>
          <button type='button' class='mt-2 mb-2 btn bg-white text-black' data-bs-toggle="modal" data-bs-target="#loadModal" @click='loadModalSuccess = false; loadModalError = false'>Load</button>
        </div>
        <!-- navigation -->
        <div>
          <button type='button' class='btn btn-link' data-bs-dismiss="offcanvas" @click='switchFrame("dialogue")'>Resume</button>
        </div>
        <div>
          <button type='button' class='btn btn-link' data-bs-dismiss="offcanvas" @click='switchFrame("title")'>Title</button>
        </div>
        <div>
          <button type='button' class='btn btn-link' data-bs-dismiss="offcanvas" @click='switchFrame("profile")'>Profile</button>
        </div>
        <div>
          <button type='button' class='btn btn-link' @click='toggleMusic()'>Music on/off</button>
        </div>
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

    <!-- modals -->
    <LoadModal @load-game='onLoadGame' v-bind:toggleSuccess='loadModalSuccess' v-bind:toggleError='loadModalError' />
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import SHA256 from 'sha256-es';
import clone from 'just-clone'
import { getPlayMusic } from './utils/music'
import { setFlag, getResultFlagsFromScript, getResultFlagsFromScene, isSceneEligible } from './utils/flags'
import { getFirstSection, getNextScene, getCurrentScene, getCurrentLine, getNextSection, getSectionByName, getSceneByName } from './utils/dialogue'
import { getStartSceneName, getStartLineName, getPlayerName, getPlayerPronoun, getPlayerPossessive, getPlayerTitle, setPlayerName, setPlayerPossessive, setPlayerPronoun, setPlayerTitle, setNickableSpeaker } from './utils/script'

import CreditFrame from './frames/CreditFrame.vue'
import StartFrame from './frames/StartFrame.vue'
import ProfileFrame from './frames/ProfileFrame.vue'
import DialogueFrame from './frames/DialogueFrame.vue'
import TitleFrame from './frames/TitleFrame.vue'
import ActionButton from './components/ActionButton.vue'
import LoadModal from './modals/LoadModal.vue'

const PREFIX_SPRITE = './assets/sprites/'
const PREFIX_BG = './assets/backgrounds/'
const PREFIX_UI = './assets/interfaces/'
const PREFIX_SCRIPT = './assets/scripts/'
const PREFIX_MUSIC = './assets/music/'

const GAME_NAME = "Project Persona"
const GAME_DEV = "mochipie95"

const FRAME_TITLE = 'TITLE FRAME'
const FRAME_DIALOGUE = "DIALOGUE FRAME"
// const FRAME_FLOWCHART = "FLOWCHART FRAME"
const FRAME_PROFILE = "PROFILE FRAME"
const FRAME_START = "START FRAME"
const FRAME_CREDIT = "CREDIT FRAME"

// const KEY_NICK_MC = 'morelle'

export default {
  name: 'App',
  components: {
    CreditFrame,
    StartFrame,
    ProfileFrame,
    DialogueFrame,
    TitleFrame,
    ActionButton,
    LoadModal
  },
  data() {
    return {
      frame: FRAME_START,
      toggleDialogue: false,
      toggleSideMenu: false,
      loadModalSuccess: false,
      loadModalError: false,
      nameChangeSuccess: false,
      nameChangeError: false,

      // music
      moosic: null,
      currentlyPlaying: '',
      isPlay: true,

      ui: {
        textbox: ''
      },
      images: {},
      osts: {},

      // default new bookmark
      bookmark: {},
      game_hash: '',

      // dialogue
      dialogue: {
        sceneName: null,
        lineName: null
      },
      speaker: '',
      script: {},

      // list of bookmarks in game (added everytime a new scene is reached, set name then)
      bookmarks: {
        // identifier
        game_name: GAME_NAME,
        game_dev: GAME_DEV,
        game_hash : '',

        // bookmarks
        list: [],
        
        // divergence
        name: null,
      }
    }
  },
  provide() {
    return {
      // explicitly provide a computed property
      bookmark: computed(() => this.bookmark),
      bookmarks: computed(() => this.bookmarks),
      dialogue: computed(() => this.dialogue),
      speaker: computed(() => this.speaker),
      script: computed(() => this.script),
      moosic: computed(() => this.moosic)
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
    // restart game
    this.restartBookmark()
    this.setDialogue(getFirstSection(this.sections, this.bookmark.flags))
    this.reloadDialogue()

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
        // load moosics
        } else if (key == 'meta__ostList') {
          for (var moose of value) {
            // static none (maybe put this in module ..?)
            if (moose != 'none') {
              // assume mp3
              try {
                this.osts[moose] = require(PREFIX_MUSIC + moose + '.mp3')
              } catch (e) {
                console.log('cannot import music: ' + moose)
              }
            }
          }
        }
      }

      // load background
      for (var bg of sect.meta__bgList) {
        if (bg != 'none') this.images['bg_' + bg] = require(PREFIX_BG + 'bg_' + bg + '.png')
      }

    }

    // load title moosic
    this.osts.title = require(PREFIX_MUSIC + 'title.mp3')
    // var titleMusic = require('./assets/music/title.mp3')

  },
  methods: {
    toggleMusic() {
      this.isPlay = !this.isPlay
      if (this.isPlay) {
        if (this.moosic) this.moosic.play()
      } else {
        this.moosic.stop()
      }
    },
    playMusic(musicStr) {
      if (musicStr == this.currentlyPlaying) return;
      if (this.moosic) this.moosic.fade(0.5, 0, 1)
      this.moosic = null
      for (const [key, value] of Object.entries(this.osts)) {
        if (key == musicStr) { 
          this.moosic = getPlayMusic(value)
          this.currentlyPlaying = musicStr
          break;
        }
      }
      if (this.moosic && this.isPlay) this.moosic.play();
    },
    getPlayerNameObject() {
      return {
        name: getPlayerName(this.sections),
        pronoun: getPlayerPronoun(this.sections),
        possessive: getPlayerPossessive(this.sections),
        title: getPlayerTitle(this.sections)
      }
    },
    updateName(player) {
        this.sections = setPlayerName(this.sections, player.name)
        this.sections = setPlayerPronoun(this.sections, player.pronoun)
        this.sections = setPlayerPossessive(this.sections, player.possessive)
        this.sections = setPlayerTitle(this.sections, player.title)

        // update isNick speaker as well...
        // static
        this.sections = setNickableSpeaker(this.sections, 'morelle', player.name) 
    },

    onUpdateName(player) {
      console.log(player)
      // set nicks based on name data for all sections, and in game data
      this.bookmarks.player = player
      try {
        this.updateName(player)

        this.nameChangeSuccess = true
        this.nameChangeError = false
      } catch(e) {
        console.log(e)
        this.nameChangeError = true
        this.nameChangeSuccess = false
      }
    },
    onLoadGame(gamedt) {
      this.loadModalSuccess = false
      this.loadModalError = false
      // validate
      try {
        var gameData = JSON.parse(gamedt)
        if (!this.validateGameHash(gameData)) {
            this.loadModalError = true
        } else {
          // load the game
          this.bookmarks = gameData
          // set nicks based on name data for all sections
          if (this.bookmarks.player) {
            this.updateName(this.bookmarks.player)
          }
          // go to dialogue
          // console.log(this.bookmarks.list[this.bookmarks.list.length - 1])
          this.onReloadGame(this.bookmarks.list[this.bookmarks.list.length - 1])
          // broadcast result
          this.loadModalSuccess = true
        }
      } catch (err) {
        // console.log(err)
        this.loadModalError = true
      }
    },

    validateGameHash(gamedt) {
      if (gamedt.game_hash) {
          return gamedt.game_hash == this.game_hash;
      }
      return false;
    },
    reloadDialogue() {
      this.toggleDialogue = !this.toggleDialogue
    },
    reloadSidemenu() {
      this.toggleSideMenu = !this.toggleSideMenu
    },
    isOfFrame(frameStr) {
      if (frameStr == "dialogue") return this.getCurrentFrame() == FRAME_DIALOGUE
      else if (frameStr == "title") return this.getCurrentFrame() == FRAME_TITLE
      else if (frameStr == "profile") return this.getCurrentFrame() == FRAME_PROFILE
      else if (frameStr == 'start') return this.getCurrentFrame() == FRAME_START
      else if (frameStr == 'credit') return this.getCurrentFrame() == FRAME_CREDIT
      return false
    },
    switchFrame(frameStr) {
      if (frameStr == "dialogue") {
        this.frame = FRAME_DIALOGUE
        this.playMusic(getCurrentScene(this.script, this.dialogue.sceneName).ost)
      }
      else if (frameStr == "title") {
        this.frame = FRAME_TITLE
        this.playMusic('title')
      }
      else if (frameStr == "profile") {
        this.nameChangeSuccess = false;
        this.nameChangeError = false;
        this.frame = FRAME_PROFILE
      } else if (frameStr == 'credit') {
        this.frame = FRAME_CREDIT
      }
      this.reloadSidemenu()
    },
    getCurrentFrame() {
      return this.frame;
    },
    getButtonActionType() {
      if (this.isOfFrame('dialogue')) return "save"
      else if (this.isOfFrame('title')) return "none"
      return "none"
    },
    
    onNextScene() {
      var nextScene = getNextScene(this.script, this.bookmark.flags, getCurrentScene(this.script, this.dialogue.sceneName).next)
      // if no next eligible scene
      if (!nextScene) {
        // to end
        this.switchFrame("credit")
      } else {
        this.dialogue.sceneName = nextScene
        var scene = getCurrentScene(this.script, this.dialogue.sceneName)
        this.setFlags(getResultFlagsFromScene(scene))
        // load first line
        this.dialogue.lineName = getStartLineName(scene)
        // load music
        console.log(scene.ost)
        this.playMusic(scene.ost)
      }
    },
    onNextLine() {
      this.dialogue.lineName = getCurrentLine(this.script, this.dialogue.sceneName, this.dialogue.lineName).next
    },
    onNextSection() {
      var nextScript = getNextSection(this.script, this.sections, this.bookmark.flags)
      if (nextScript == null) {
        // end game
        this.switchFrame("credit")
      } else {
        this.setDialogue(getNextSection(this.script, this.sections, this.bookmark.flags))
        this.reloadDialogue()
      }
    },
    onSetBookmark() {
      // save user created bookmark
      var bm__c = clone(this.bookmark)
      bm__c.auto = false
      this.bookmarks.list.push(bm__c)
    },
    onRestartGame() {
        // to dialogue frame, new game
        this.restartBookmark()
        var section = getFirstSection(this.sections, this.bookmark.flags)
        this.setDialogue(section)
        this.reloadDialogue()
        this.switchFrame("dialogue")
        // console.log(this.bookmark.flags)
    },
    onReloadGame(bm) {
      this.bookmark = bm
      this.setDialogueAfterLoad()
      this.reloadDialogue()
      this.switchFrame("dialogue")
    },
    onQuickLink(linkStr) {
      if (linkStr == "start") {
        this.switchFrame("dialogue")
      } else if (linkStr == "load") {
        // to load modal
        this.loadModalSuccess = false
        this.loadModalError = false
      }
    },
    onEmitProgress(stuff) {
      this.bookmark.current_section = stuff.section
      this.bookmark.current_scene = stuff.scene
      this.bookmark.current_line = stuff.line
      // console.log(this.bookmark.flags)
    },

    onSelectOption(stuff) {
      console.log('selected: ' + stuff.option.name)
      this.bookmark.choices[stuff.section] = stuff.option
      // enact the flags
      this.setFlags(stuff.option.giving)
      // console.log(this.bookmark.flags)
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
      this.bookmarks.game_hash = this.game_hash
      // console.log(this.game_hash)

      // console.log(sha256.sync('hey there'))
    },

    // set dialogue after load
    setDialogueAfterLoad() {
      this.script = getSectionByName(this.sections, this.bookmark.current_section)
      this.dialogue.sceneName = this.bookmark.current_scene
      this.dialogue.lineName = this.bookmark.current_line
      // console.log(this.bookmarks.list.length)
    },
    // set dialogue
    setDialogue(section) {
      // first eligible section
      //this.script = getFirstSection(this.sections, this.bookmark.flags)
      this.script = section
      // enact section flags
      this.setFlags(getResultFlagsFromScript(this.script))
      // get first eligible scene ToT
      var firstscene = getSceneByName(this.script, getStartSceneName(this.script))
      var firstSceneName = firstscene.keyName
      if (!isSceneEligible(this.bookmark.flags, firstscene)) {
        firstSceneName = getNextScene(this.script, this.bookmark.flags, firstscene.next)
      }
      this.dialogue.sceneName = firstSceneName
      // enact scene flags
      var scene = getCurrentScene(this.script, this.dialogue.sceneName)
      this.setFlags(getResultFlagsFromScene(scene))
      // first line
      this.dialogue.lineName = getStartLineName(scene)
      // load music
      console.log(scene.ost)
      this.playMusic(scene.ost)

      // set progress
      this.onEmitProgress({
        section: section.meta__id,
        scene: this.dialogue.sceneName,
        line: this.dialogue.lineName
      })
      // auto save section bookmark
      this.bookmarks.list.push(clone(this.bookmark))
    },
    // restart bookmark
    restartBookmark() {
      // default new bookmark
      this.bookmark = {
        // identifier
        game_hash : this.game_hash,

        // reading progress
        current_section: '',
        current_scene: '',
        current_line: '',

        // auto generated
        auto: true,

        // divergence
        flags: [],
        choices: {}
      }
    },
    // import all scripts here, add first section
    loadScripts() {
      const script1_1 = require(PREFIX_SCRIPT + 'scene 1.1.json')
      const script1_2 = require(PREFIX_SCRIPT + 'scene 1.2.json')
      const script2_1 = require(PREFIX_SCRIPT + 'scene 2.1.json')
      const script2_2 = require(PREFIX_SCRIPT + 'scene 2.2.json')
      
      // first eligible section will be played first, so order matters
      this.sections.push(script1_1)
      this.sections.push(script1_2)
      this.sections.push(script2_1)
      this.sections.push(script2_2)
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
