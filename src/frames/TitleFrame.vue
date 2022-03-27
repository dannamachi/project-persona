<template>
    <div class='wrapper'>
        <div :class='{
        gameBox: true,
        showLeft: showing == "left",
        showRight: showing == "right",
        showCenter: showing == "center",
        titleBackground: true
        }'>
            <!-- title screen quick link -->
            <div class='container-fluid aboveText pt-5'>

                <div class='my-5 row justify-content-end'>
                    <div class='col'>
                        <p class='fs-3 btn-primary text-end' @click='quickLinkTo("start")'>
                            Start
                        </p>
                    </div>
                </div>

                <div class='my-5 row justify-content-end'>
                    <div class='col'>
                        <p class='fs-3 btn-primary text-end' @click='quickLinkTo("load")'>
                            Load
                        </p>
                    </div>
                </div>
    
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        quickLinkTo(linkStr) {
            this.$emit("quickLink", linkStr)
        }
    }
}
</script>

<style scoped>
.titleBackground {
    background-image: url('../assets/interfaces/title_screen.png')
}
</style>