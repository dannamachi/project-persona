<template>
    <div class="modal fade text-black" id="loadModal" tabindex="-1" aria-labelledby="loadModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="loadModalLabel">
                        Load game
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input name="text" placeholder="paste save file content here..." v-model='inputJSON' />
                    <button class='mx-2 btn btn-dark' type='button' @click='loadGame()'>Load</button>
                    <div v-if='toggleError' class="alert alert-danger" role="alert">
                        {{ errMsg }}
                    </div>
                    <div v-if='toggleSuccess' class="alert alert-success" role="alert">
                        {{ successMsg }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    inject: ['bookmarks'],
    props: ['toggleSuccess', 'toggleError'],
    data() {
        return {
            inputJSON: '',
            errMsg: 'Invalid save file !',
            successMsg: 'Success ! Please close this window ^^'
        }
    },
    methods: {
        validateGameHash(gamedt) {
            if (gamedt.game_hash) {
                return gamedt.game_hash == this.bookmarks.value.game_hash;
            }
            return false;
        },
        loadGame() {
            // emit game data
            this.$emit('loadGame', this.inputJSON)
            this.inputJSON = ''
        }
    }
}
</script>

<style scoped>

</style>