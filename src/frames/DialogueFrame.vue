<template>
    <div class='wrapper'>
        <div :class='{
        gameBox: true,
        showLeft: showing == "left",
        showRight: showing == "right",
        showCenter: showing == "center"
        }' :style="{ 
            backgroundImage: background ? 'url(\'' + background + '\')' : ''
        }">

        <!-- sprite display -->
        <div v-if='notChoice' class='container-fluid aboveText' :style="{ 
            backgroundImage: sprite ? 'url(\'' + sprite.left + '\'), url(\'' + sprite.center + '\'), url(\'' + sprite.right + '\')' : ''
        }">
            <!-- <button @click='toggleShowing("left")'>left</button>
            <button @click='toggleShowing("center")'>center</button>
            <button @click='toggleShowing("right")'>right</button>
            <button v-if='!canAdvance' @click='restartScript()'>restart</button> -->
            <!-- {{ isLoaded() ? getCurrentScene().keyName : '' }} -->
        </div>
        <!-- if choice -->
        <!-- choice in column -->
        <div v-else class='container-fluid aboveText pt-3'>
            
          <div v-for='(option, index) in m__getEligibleOptions()' :key='index' class='optionSpacing row justify-content-end'>
            <div class='col-auto'>
              <div class='bg-black text-white text-end optionBox' @click='selectOption(option)'>
                {{ option.name }}
              </div>
            </div>
          </div>
  
        </div>

        <!-- textbox -->
        <div class='container-fluid textBox' @click='advanceText()' :style="{
              backgroundImage: ui ? 'url(\'' + ui.textbox + '\')' : ''
            }">
            <div class='mcPart float-start' :style="{
              backgroundImage: sprite ? 'url(\'' + sprite.player + '\')' : ''
            }">
            </div>
            <div class='textPart'>
              <p class='text-center speakerBox'>{{ isLoaded() ? m__getSpeakerName() : 'no one' }}</p>
              <p v-if='notChoice' class='text-start text-wrap text-break textingBox'>
                {{ isLoaded() ? m__getCurrentText() : 'nothing at all' }}
              </p>
              <p v-else class='text-start text-wrap text-break textingBox'>
                {{ m__getChoicePrompt() }}
              </p>
            </div>
        </div>
<!-- backgroundImage: 'url(\'' + sprite.player + '\')' -->
        <!-- mc box -->
        <!-- <div class='position-absolute bottom-0 start-0'>
          <img v-if='sprite.player != ""' :src='sprite.player' width='200' height='250'/>
        </div> -->

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
        'sections', 'background', 'sprite'
  ],
  inject: ['bookmark', 'dialogue', 'script', 'speaker', 'display'],
  data() {
    return {
        showing: "left",
        showingText: "Jfdjnsfjsn is simply dummy text of the printing and typesetting industry. ejcnjsdn has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        // speaker: 'hello',
        // dialogue: {
        //     sceneName: null,
        //     lineName: null
        // },
        canAdvance: true,
        //script: {},
        notChoice: true
    }
  },
  created() {
    // load the scene
    // this.loadScene()
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
              this.$emit("toNextSectionWithAnima")
            }
          } else {
            // next scene
            this.$emit("toNextSceneWithAnima")
          }
        } else {
          // next line
          this.$emit("toNextLine")
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

    // loadScene() {
    //   // clear scene
    //   this.background = ''
    //   var scene = this.m__getCurrentScene()
    //   this.background = this.images['bg_' + scene.background]
    //   // load first line
    //   this.loadSprite()
    // },
    // loadSprite() {
    //   // clear display
    //   for (const [key1, value1] of Object.entries(this.sprite)) {
    //     value1
    //     this.sprite[key1] = ''
    //   }
    //   // load display
    //   var line = this.m__getCurrentLine()
    //   for (const [key, value] of Object.entries(line)) {
    //     if (key.startsWith('sprite__')) {
    //       // assume _ in between and png
    //       this.sprite[value.pos] = this.images[value.keyName + "_" + value.exp]
    //     }
    //   }
    //   // emit progress
    //   this.emitProgress()
    // },
    
  }
}
</script>

<style scoped>
.aboveText {
  height: 70%;
  /* background-image: url('assets/Morelle_dazed.png'),url('assets/Morelle_dazed.png'),url('assets/Morelle_dazed.png'); */
  background-size: contain,contain,contain;
  background-repeat: no-repeat,no-repeat,no-repeat;
  background-position: 5% 100%,center,95% 100%;
}

.mcPart {
  display: inline-block;
  width: 30vh;
  height: 100%;
  background-position: left;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.textPart {
  display: inline-block;
  width: calc(100% - 30vh);
  height: 100%;
  background-position: left;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: 2.5vmin;
}

.textBox {
  width: 100%;
  height: 30%;
  /* background-image: url('assets/textbox.jpeg'); */
  /* background-position: left; */
  padding-right: 1rem;
  padding-left: 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
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

@media (max-width: 720px) {
  .optionBox {
    font-size: 20px;
    width: 400px;
  }
  .optionSpacing {
    margin-top: 30px;
  }
}

@media (min-width: 720px) {
  .optionBox {
    font-size: 30px;
    width: 600px;
  }
    .optionSpacing {
    margin-top: 35px;
  }
}

</style>