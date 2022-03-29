<template>
    <div class='wrapper'>
        <div :class='{
        gameBox: true,
        showLeft: showing == "left",
        showRight: showing == "right",
        showCenter: showing == "center"
        }' :style="{ 
            backgroundImage: 'url(\'' + background + '\')'
        }">

        <!-- sprite display -->
        <div v-if='notChoice' class='container-fluid aboveText' :style="{ 
            backgroundImage: 'url(\'' + sprite.left + '\'), url(\'' + sprite.center + '\'), url(\'' + sprite.right + '\')'
        }">
            <!-- <button @click='toggleShowing("left")'>left</button>
            <button @click='toggleShowing("center")'>center</button>
            <button @click='toggleShowing("right")'>right</button>
            <button v-if='!canAdvance' @click='restartScript()'>restart</button> -->
            <!-- {{ isLoaded() ? getCurrentScene().keyName : '' }} -->
        </div>
        <!-- if choice -->
        <!-- choice in column -->
        <div v-else class='container-fluid aboveText pt-5'>
            
          <div v-for='(option, index) in m__getEligibleOptions()' :key='index' class='my-5 row justify-content-end'>
            <div class='col'>
            <p class='fs-3 bg-black btn-link text-end' @click='selectOption(option)'>
              {{ option.name }}
            </p>
            </div>
          </div>
  
        </div>

        <!-- textbox -->
        <div class='container-fluid textBox float-end' @click='advanceText()' :style="{
            backgroundImage: 'url(\'' + ui.textbox + '\')'
            }">
            <!-- fix textbox shift when empty speaker -->
            <p class='text-center speakerBox'>{{ isLoaded() ? m__getSpeakerName() : 'no one' }}</p>
            <p v-if='notChoice' class='text-start text-wrap text-break textingBox'>
              {{ isLoaded() ? m__getCurrentText() : 'nothing at all' }}
            </p>
            <p v-else class='text-start text-wrap text-break textingBox'>
              {{ m__getChoicePrompt() }}
            </p>
        </div>
<!-- backgroundImage: 'url(\'' + sprite.player + '\')' -->
        <!-- mc box -->
        <div class='position-absolute bottom-0 start-0'>
          <img v-if='sprite.player != ""' :src='sprite.player' width='200' height='250'/>
        </div>

        </div>
  </div>
</template>

<script>
import { getCurrentScene, getCurrentLine, haveChoice, getSpeakerName, getCurrentText, getEligibleOptions, getChoicePrompt } from '../utils/dialogue'
import { getSectionName, getEndSceneName, getEndLineName } from '../utils/script'

export default {
  name: 'DialogueFrame',
  props: [
        'ui', 'images',
        'sections'
  ],
  inject: ['bookmark', 'dialogue', 'script', 'speaker'],
  data() {
    return {
        sprite: {
            left: '',
            right: '',
            center: '',
            player: ''
        },
        showing: "left",
        showingText: "Jfdjnsfjsn is simply dummy text of the printing and typesetting industry. ejcnjsdn has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        // speaker: 'hello',
        // dialogue: {
        //     sceneName: null,
        //     lineName: null
        // },
        canAdvance: true,
        background: '',
        //script: {},
        notChoice: true
    }
  },
  created() {
    // load the scene
    this.loadScene()
    this.canAdvance = true
  },
  methods: {
    getScript() { return this.script.value; },
    getSceneName() { return this.dialogue.value.sceneName; },
    getLineName() { return this.dialogue.value.lineName; },
    getFlags() { return this.bookmark.value.flags; },

    m__getCurrentScene() {
      return getCurrentScene(this.getScript(), this.getSceneName());
    },
    m__getCurrentLine() {
      return getCurrentLine(this.getScript(), this.getSceneName(), this.getLineName())
    },

    m__getSpeakerName() {
      return getSpeakerName(this.getScript(), this.getSceneName(), this.getLineName())
    },
    m__getCurrentText() {
      return getCurrentText(this.getScript(), this.getSceneName(), this.getLineName())
    },
    m__getEligibleOptions() {
      return getEligibleOptions(this.getScript(), this.getFlags())
    },
    m__getChoicePrompt() {
      return getChoicePrompt(this.getScript())
    },

    isLoaded() {
      return this.getSceneName() && this.getLineName()
    },

    selectOption(opt) {
      this.$emit('selectOption', {
        section: getSectionName(this.getScript()),
        option: opt
      })
      this.notChoice = true
      this.canAdvance = true
      this.$emit("toNextSection")
      this.loadScene()
    },

    advanceText() {
      // add next section, choice check !
      if (this.isLoaded() && this.canAdvance) {
        // to do: abstract this scene__ and line__ bs
        // check if scene end
        if (getEndLineName(this.m__getCurrentScene()) == 'line__' + this.getLineName() || this.m__getCurrentLine().next == '') {
          // check if section end
          if (getEndSceneName(this.getScript()) == 'scene__' + this.getSceneName() || this.m__getCurrentScene().next == '') {
            // check if choice
            if (haveChoice(this.getScript(), this.getFlags())) {
              // to choice
              this.notChoice = false
              this.canAdvance = false
            } else {
              // next section
              this.$emit("toNextSection")
              this.loadScene()
            }
          } else {
            // next scene
            this.$emit("toNextScene")
            this.loadScene()
          }
        } else {
          // next line
          this.$emit("toNextLine")
          this.loadSprite()
        }
      }
    },
    toggleShowing(thing) {
      if (window.innerWidth < 1000) this.showing = thing
    },

    emitProgress() {
      this.$emit('passProgress', {
        section: getSectionName(this.getScript()),
        scene: this.m__getCurrentScene().keyName,
        line: this.m__getCurrentLine().keyName
      })
    },

    loadScene() {
      var scene = this.m__getCurrentScene()
      this.background = this.images['bg_' + scene.background]
      // load first line
      this.loadSprite()
    },
    loadSprite() {
      // clear display
      for (const [key1, value1] of Object.entries(this.sprite)) {
        value1
        this.sprite[key1] = ''
      }
      // load display
      var line = this.m__getCurrentLine()
      for (const [key, value] of Object.entries(line)) {
        if (key.startsWith('sprite__')) {
          // assume _ in between and png
          this.sprite[value.pos] = this.images[value.keyName + "_" + value.exp]
        }
      }
      // emit progress
      this.emitProgress()
    },
    
  }
}
</script>

<style scoped>
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
  width: 80%;
  height: 30%;
  border-style: solid;
  border-color: greenyellow;
  /* background-image: url('assets/textbox.jpeg'); */
  background-position: left;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: 3.5vmin;
}

.speakerBox {
  font-size: 3.5vmin;
  margin: 1vmin;
  height: 20%;
}
.textingBox {
  width: 100%;
  font-size: 3vmin;
  margin-left: 4vmin;
  padding-right: 5vmin;
}

</style>