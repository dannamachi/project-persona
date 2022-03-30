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
                                <input type="text" :placeholder='getDefaultPlayerName()' v-model="player.name" maxlength="20" @keypress.enter.prevent />
                            </div>
                            <!-- input box for pronoun (apply to gray as well) -->
                            <div class='mt-4'>
                                <p>Pronoun:</p>
                                <input type="text" :placeholder='getDefaultPlayerPronoun()' v-model="player.pronoun" maxlength="20" @keypress.enter.prevent/>
                            </div>
                        </div>
                        <div class='col-sm-6'>
                            <!-- input box for possessive, to someself as well -->
                            <div class='mt-4'>
                                <p>Possessive pronoun:</p>
                                <input type="text" :placeholder='getDefaultPlayerPossessive()' v-model="player.possessive" maxlength="20" @keypress.enter.prevent/>
                            </div>
                            <!-- young someone -->
                            <div class='mt-4'>
                                <p>Title:</p>
                                <input type="text" :placeholder='getDefaultPlayerTitle()' v-model="player.title" maxlength="20" @keypress.enter.prevent/>
                            </div>
                        </div>
                    </div>
                    <div class='row'>
                        <!-- button to submit -->
                        <div class='mt-4'>
                            <button type='button' class='btn btn-info' @click='submitNameChange()'>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            player: {
                name         : '',
                pronoun      : '',
                possessive   : '',
                title        : ''
            }
        }
    },
    methods: {
        getDefaultPlayerName() { return 'Morelle'; },
        getDefaultPlayerPronoun() { return 'she'; },
        getDefaultPlayerPossessive() { return 'her'; },
        getDefaultPlayerTitle() { return 'miss'; },

        submitNameChange() {

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