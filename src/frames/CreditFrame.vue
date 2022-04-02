<template>
    <div class='wrapper'>
        <div :class='{
        gameBox: true,
        showLeft: showing == "left",
        showRight: showing == "right",
        showCenter: showing == "center",
        }'>
            <!-- scroll mwahaha -->
            <div class='container-fluid creditBox bg-black' @scroll.prevent ref='scrollBox'>
                 <!-- test -->
                <!-- <div class='position-absolute bottom-0 start 0 fs-1'>{{ getScrollTopValue() }}</div>
                <div class='position-absolute bottom-0 start-50 fs-1'>{{ getScrollHeightValue() }}</div> -->
                <div class='fs-3 my-4' v-for='(line, index) in getCreditLines()' :key='index'>
                    {{ line }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
    setup(props, context) {
        const scrollBox = ref(null);
        var isEnd = ref(false)

        const scrollCredits = () => {
            if (scrollBox.value) {
                console.log('sth?')
                var oldVal = scrollBox.value.scrollTop
                if (!isEnd.value) {
                    scrollBox.value.scrollTop += 1;
                    console.log(scrollBox.value.scrollTop)
                }
                if (scrollBox.value.scrollTop + 1 > scrollBox.value.scrollHeight || scrollBox.value.scrollTop == oldVal) {
                    isEnd.value = true;
                }
            }
        }

        const getScrollTopValue = () => {
            if (scrollBox.value) return scrollBox.value.scrollTop;
            return -1
        }

        const getScrollHeightValue = () => {
            if (scrollBox.value) return scrollBox.value.scrollHeight;
            return -1
        }

        const scrollInterval = setInterval(scrollCredits, 15)

        watch(isEnd, (currentValue, oldValue) => {
            console.log(oldValue)
            if (currentValue) {
                clearInterval(scrollInterval)
                context.emit('returnTitle')
            }
        });

        // onUpdated(() => {
        //   messagesDoc.value.scrollTop = messagesDoc.value.scrollHeight
        // })
        return { scrollBox, scrollInterval, isEnd, getScrollTopValue, getScrollHeightValue }
    },
    methods: {
        getCreditLines() {
            return this.getCredits().split('**')
        },
        getCredits() {
            var cString = ''
            cString += 'Gray Solace is a Visual Novel made by:**Mochi (coding)**Cree (sprites)**Sarah (backgrounds)**Idle (narrative)****'
            cString += 'It was made using:**'
            cString += 'Vue 3: https://vuejs.org/**'
            cString += 'Script Builder: https://mochimochi95.itch.io/script-writer****'
            cString += 'Music attributions:**'
            cString += '- Trio for Piano, Cello, and Clarinet by Kevin MacLeod**Link: https://incompetech.filmmusic.io/song/4547-trio-for-piano-cello-and-clarinet**License: https://filmmusic.io/standard-license**- White by Kevin MacLeod**Link: https://incompetech.filmmusic.io/song/4626-white**License: https://filmmusic.io/standard-license**- Water Lily by Kevin MacLeod**Link: https://incompetech.filmmusic.io/song/4609-water-lily**License: https://filmmusic.io/standard-license**- Loss by Kevin MacLeod**Link: https://incompetech.filmmusic.io/song/4003-loss**License: https://filmmusic.io/standard-license**- Waltz (Tschikovsky Op. 40) by Kevin MacLeod**Link: https://incompetech.filmmusic.io/song/4605-waltz-tschikovsky-op-40-**License: https://filmmusic.io/standard-license**- Facile by Kevin MacLeod**Link: https://incompetech.filmmusic.io/song/3733-facile**License: https://filmmusic.io/standard-license'
            return cString
        }
    }
}
</script>

<style scoped>
.creditBox {
    overflow: hidden;
    width: 100%;
    height: 100%;
}
</style>