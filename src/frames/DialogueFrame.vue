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
            backgroundImage: 'url(\'' + sprite.left + '\'), url(\'' + sprite.center + '\'), url(\'' + sprite.player + '\')'
        }">
            <!-- <button @click='toggleShowing("left")'>left</button>
            <button @click='toggleShowing("center")'>center</button>
            <button @click='toggleShowing("right")'>right</button> -->
            <button v-if='!canAdvance' @click='restartScript()'>restart</button>
            <!-- {{ isLoaded() ? getCurrentScene().keyName : '' }} -->
        </div>
        <!-- if choice -->
        <!-- to do: choice in column -->
        <div v-else class='container-fluid aboveText d-flex align-items-center justify-content-end'>
          <div v-for='(option, index) in script.choice.options' :key='index'>
            <button v-if='isEligibleOption(option)' @click='selectOption(option)'>
              {{ option.name }}
            </button>
          </div>
        </div>

        <!-- textbox -->
        <div class='container-fluid textBox' @click='advanceText()' :style="{
            backgroundImage: 'url(\'' + ui.textbox + '\')'
            }">
            <!-- to do: fix textbox shift when empty speaker -->
            <p class='text-center speakerBox'>{{ isLoaded() ? getSpeakerName() : 'no one' }}</p>
            <p v-if='notChoice' class='text-start text-wrap text-break textingBox'>
              {{ isLoaded() ? getCurrentText() : 'nothing at all' }}
            </p>
            <p v-else class='text-start text-wrap text-break textingBox'>
              {{ script.choice.prompt }}
            </p>
        </div>

        </div>
  </div>
</template>

<script>
export default {
  name: 'DialogueFrame',
  props: [
        'ui', 'images',
        'sections'
  ],
  inject: ['bookmark'],
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
        speaker: 'hello',
        dialogue: {
            sceneName: null,
            lineName: null
        },
        canAdvance: true,
        background: '',
        script: {},
        notChoice: true
    }
  },
  created() {
    // restart script pointer
    this.restartScript()
  },
  methods: {
    restartScript() {
      // first eligible section
      this.script = this.getFirstSection()
      // first scene
      this.dialogue.sceneName = this.script.meta__startName.slice(7)
      this.loadScene()
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
    getSpeakerName() {
      var speaker = this.getCurrentLine().speaker
      if (speaker.keyName == '__narrator') return ''
      else return speaker.name
    },
    getFirstSection() {
      for (var i=0; i<this.sections.length; i++) {
        if (this.isEligibleSection(this.sections[i])) {
          return this.sections[i]
        }
      }
      return null
    },
    getNextSection() {
      for (var sect of this.sections) {
        if (sect.meta__id != this.script.meta__id && sect.meta__previous == this.script.meta__id) {
          if (this.isEligibleSection(sect)) return sect
        }
      }
      return null
    },
    getNextScene(nextScene) {
      if (nextScene == '' || nextScene == null) return null
      else {
        if (this.isEligibleScene(nextScene)) return nextScene
        else return this.getNextScene(this.script['scene__' + nextScene].next)
      }
    },

    isEligibleScene(sceneName) {
      var scn = this.script['scene__' + sceneName]
      for (var flag of scn.meta__flagRList) {
        if (!this.isFlagFulfilled(flag)) return false
      }
      return true
    },
    isEligibleSection(sect) {
      for (var flag of sect.meta__flagList) {
        if (!this.isFlagFulfilled(flag)) return false
      }
      return true
    },
    isFlagFulfilled(flag) {
      var ftype = flag.type
      for (var fl of this.bookmark.flags) {
        if (fl.name == flag.name) {
          if (ftype == 'flag' && fl.type == 'flag') {
            // flag exists, cleared
            return true
          } else if (ftype == 'more' && fl.type == 'score') {
            return fl.score >= flag.score
          } else if (ftype == 'less' && fl.type == 'score') {
            return fl.score < flag.score
          } else if (ftype == 'value' && fl.type == 'value') {
            return fl.value = flag.value
          } else if (ftype == 'diff' && fl.type == 'value') {
            return fl.value != flag.value
          }
        }
      }
      return false
    },
    isEligibleOption(opt) {
      for (var flag of opt.required) {
        if (!this.isFlagFulfilled(flag)) return false
      }
      return true
    },

    selectOption(opt) {
      this.$emit('selectOption', {
        scene: this.getCurrentScene().meta__id,
        option: opt
      })
      this.notChoice = true
      this.canAdvance = true
      this.advanceSection()
    },
    haveChoice() {
      var choice = this.script.choice
      for (var opt of choice.options) {
          // TO DO: main dialogue data: saved in App
          // always have a bookmark loaded/new bookmark created
          // check if any eligible options
          if (this.isEligibleOption(opt)) return true
      }
      return false
    },

    advanceSection() {
      // advance section (to do: add scene/section transition later?)
      var nextScript = this.getNextSection()
      // TO DO: enact the flags
      // check if end game
      if (nextScript == null) {
        this.canAdvance = false
      } else {
        this.script = nextScript
        // load scene
        this.dialogue.sceneName = this.script.meta__startName.slice(7)
        this.loadScene()
      }
    },
    advanceText() {
      // TO DO: add next section, choice check !
      if (this.isLoaded() && this.canAdvance) {
        // check if scene end
        if (this.getCurrentScene().meta__endName == 'line__' + this.dialogue.lineName || this.getCurrentLine().next == '') {
          // check if section end
          if (this.script.meta__endName == 'scene__' + this.dialogue.sceneName || this.getCurrentScene().next == '') {
            // check if choice
            if (this.haveChoice()) {
              // to choice
              this.notChoice = false
              this.canAdvance = false
            } else {
              this.advanceSection()
            }
          } else {
            // next scene
            this.dialogue.sceneName = this.getNextScene(this.getCurrentScene().next)
            this.loadScene()
            // TO DO: enact the flags
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

    loadScene() {
      var scene = this.getCurrentScene()
      this.dialogue.lineName = scene.meta__startName.slice(6)
      this.background = this.images['bg_' + scene.background]
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
    getCurrentText() {
      var text = this.parseNick(this.parseNick(this.getCurrentLine().text), 'p')
      if (text.length > 1) return text[0].toUpperCase() + text.substring(1)
      else if (text.length > 0) return text.toUpperCase()
      else return '---'
    },
    getMatchingNick(thing) {
      for (var nick of this.script.nicks) {
        if (nick.name == thing) return nick
      }
      return null
    },
    parseNick(line, type='n') {
      var startSym = '{@'
      var endSym = '@}'
      if (type == 'p') {
        startSym = '{!'
        endSym = '!}'
      }
      var position1 = line.search(startSym);
      var position2 = -1
      if (position1 != -1) position2 = line.substring(position1).search(endSym)
      if (position1 == -1 || position2 == -1) return line

      var text = line
      var nick
      var newLine = ''
      var someCond = true
      while (someCond) {
        nick = text.substring(position1 + 2, position1 + position2)
        var matchingNick = this.getMatchingNick(nick)
        if (matchingNick != null) {
          if (type == 'p') newLine += text.substring(0, position1) + matchingNick.pronoun
          else newLine += text.substring(0, position1) + matchingNick.nick
        } else {
          newLine += text.substring(0, position1)
        }
        // console.log('text:' + text)
        // console.log('newline:' + newLine)
        text = text.substring(position1 + position2 + 2)
        position1 = text.search(startSym);
        if (position1 != -1) position2 = text.substring(position1).search(endSym)
        if (position1 == -1 || position2 == -1) {
          newLine += text
          someCond = false
        }
      }
      // console.log(newLine)
      return newLine
    },
  }
}
</script>

<style scoped>
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