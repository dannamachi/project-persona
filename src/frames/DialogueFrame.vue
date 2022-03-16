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

        <div class='container-fluid aboveText' :style="{ 
            backgroundImage: 'url(\'' + sprite.left + '\'), url(\'' + sprite.center + '\'), url(\'' + sprite.player + '\')'
        }">
            <!-- <button @click='toggleShowing("left")'>left</button>
            <button @click='toggleShowing("center")'>center</button>
            <button @click='toggleShowing("right")'>right</button> -->
            <button @click='restartScript()'>restart</button>
            <!-- {{ isLoaded() ? getCurrentScene().keyName : '' }} -->
        </div>
        <div class='container-fluid textBox' @click='advanceText()' :style="{
            backgroundImage: 'url(\'' + ui.textbox + '\')'
            }">
            <p class='text-center speakerBox'>{{ isLoaded() ? getCurrentLine().speaker.name : 'no one' }}</p>
            <p class='text-start text-wrap text-break textingBox'>{{ isLoaded() ? getCurrentText() : 'nothing at all' }}</p>
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
        canAdvance: false,
        background: '',
        script: {},
        sectionIndex : 0
    }
  },
  created() {
    // restart script pointer
    this.restartScript()
  },
  methods: {
    restartScript() {
      // first section
      this.sectionIndex = 0
      this.script = this.sections[this.sectionIndex]
      // first scene
      this.dialogue.sceneName = this.script.meta__startName.slice(7)
      this.dialogue.lineName = this.getCurrentScene().meta__startName.slice(6)
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
    advanceText() {
      // TO DO: add next section, choice check !
      if (this.isLoaded() && this.canAdvance) {
        // check if scene end
        if (this.getCurrentScene().meta__endName == 'line__' + this.dialogue.lineName || this.getCurrentLine().next == '') {
          // check if section end
          if (this.script.meta__endName == 'scene__' + this.dialogue.sceneName || this.getCurrentScene().next == '') {
            // check if choice

            // if (this.script.choice) {
              
            // } else {
            //   // end story
            //   this.canAdvance = false
            // }
          } else {
            // next scene
            this.dialogue.sceneName = this.getCurrentScene().next
            this.dialogue.lineName = this.getCurrentScene().meta__startName.slice(6)
            this.loadScene()
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
    // TO DO: parse and replace with corresponding nick/pronoun
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
}
.textingBox {
  width: 100%;
  font-size: 3vmin;
  margin-left: 4vmin;
  padding-right: 5vmin;
}

</style>