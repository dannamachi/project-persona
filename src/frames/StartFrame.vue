<template>
    <div class='wrapper'>
        <div :class='{
        gameBox: true,
        showLeft: showing == "left",
        showRight: showing == "right",
        showCenter: showing == "center",
        titleBackground: true
        }'>
            <div class='row titleBox align-items-center justify-content-center'>
                <div class='col'>
                    <img class='imageBox' src='../assets/interfaces/logo.png' />
                    <p class='fs-3 btn-link text-white' @click='startGame()'>
                        Start
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        startGame() {
            this.$emit('startGame')
        }
    }
}
</script>

<style scoped>

@media (min-width: 630px) {
  .imageBox {
    width: 630px;
    height: 500px;
  }
}

@media (max-width: 630px) {
  .imageBox {
    width: 100vw;
    height: calc(100vw / 630 * 500);
  }
}

.titleBox {
    height: 100%;
}
.titleBackground {
    background-image: url('../assets/interfaces/start_screen.jpg')
}
</style>