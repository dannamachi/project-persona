<template>
    <div class='wrapper'>
        <div :class='{
        gameBox: true,
        showLeft: showing == "left",
        showRight: showing == "right",
        showCenter: showing == "center",
        titleBackground: true
        }'>
            <div class='row ms-4 fs-1 text-black justify-content-md-center'>Profile</div>
            <div class='row ms-4 justify-content-md-center'>
                <div class='col-auto bg-black text-white py-3 rounded'>
                    <div class='row'>
                        <div class='col-sm-6'>
                            <!-- input box for player name -->
                            <div class='mt-4'>
                                <p>Name:</p>
                                <input type="text" :placeholder='"<" + playerName.name + ">"' v-model="player.name" maxlength="20" @keypress.enter.prevent />
                            </div>
                            <!-- input box for pronoun (apply to gray as well) -->
                            <div class='mt-4'>
                                <p>Pronoun:</p>
                                <input type="text" :placeholder='"<" + playerName.pronoun + ">"' v-model="player.pronoun" maxlength="20" @keypress.enter.prevent/>
                            </div>
                        </div>
                        <div class='col-sm-6'>
                            <!-- input box for possessive, to someself as well -->
                            <div class='mt-4'>
                                <p>Possessive pronoun:</p>
                                <input type="text" :placeholder='"<" + playerName.possessive + ">"' v-model="player.possessive" maxlength="20" @keypress.enter.prevent/>
                            </div>
                            <!-- young someone -->
                            <div class='mt-4'>
                                <p>Title:</p>
                                <input type="text" :placeholder='"<" + playerName.title + ">"' v-model="player.title" maxlength="20" @keypress.enter.prevent/>
                            </div>
                        </div>
                    </div>
                    <div class='row'>
                        <!-- button to submit -->
                        <div class='mt-4'>
                            <button type='button' class='btn btn-info' @click='submitNameChange()'>Update</button>
                        </div>
                    </div>
                    <div class='row'>
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
    </div>
</template>

<script>
export default {
    props: ['toggleError', 'toggleSuccess', 'playerName'],
    data() {
        return {
            player: {
                name         : '',
                pronoun      : '',
                possessive   : '',
                title        : ''
            },
            errMsg       : 'Invalid input, please try again...',
            successMsg   : 'Name updated !'
        }
    },
    methods: {
        submitNameChange() {
            // check empty
            if (this.player.name.length == 0 || this.player.pronoun.length == 0 || this.player.possessive.length == 0 || this.player.title.length == 0) {
                this.$emit('emptyAlert')
                return
            }
            this.$emit('nameChange', this.player)
            this.player = {
                name         : '',
                pronoun      : '',
                possessive   : '',
                title        : ''
            }
        }
    }
}
</script>

<style scoped>
/* to do: change profile background or remove */
.titleBackground {
    background-image: url('../assets/backgrounds/bg_flat.png')
}
</style>