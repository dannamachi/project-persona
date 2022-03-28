<template>
    <div>
        <button v-if='showingButton' type='button' class='btn btn-info' @click='actionClick()'> {{ getButtonText() }}</button>
    </div>
</template>

<script>
import clone from 'just-clone';

export default {
    props: ['actionType'],
    data() {
        return {
            showingButton: true
        }
    },
    inject: ['bookmarks', 'bookmark'],
    methods: {
        onSaveBookmark() {
            // add current bookmark to list
            this.$emit('setBookmark')
            // download bookmarks / game data
            // console.log(this.bookmarks.value)
            var bm = clone(this.bookmarks.value)
            require("downloadjs")(JSON.stringify(bm), bm.game_name + ".json", "text/plain");
        },
        actionClick() {
            switch (this.actionType) {
                case "save":
                    this.onSaveBookmark()
            }
        },
        getButtonText() {
            switch (this.actionType) {
                case "save":
                    return "Save";
                case "load":
                    return "Load";
            }
            this.showingButton = false
            return "";
        }
    }
}
</script>

<style scoped>

</style>