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

                <div class='my-5 row justify-content-end px-2'>
                    <div class='col-2 float-end bg-black'>
                        <div class='fs-3 text-white text-center' @click='quickLinkTo("start")'>
                            Start
                        </div>
                    </div>
                </div>

                <div class='my-5 row justify-content-end px-2'>
                    <div class='col-2 float-end bg-black'>
                        <div class='fs-3 text-white text-center' data-bs-toggle="modal" data-bs-target="#loadModal" @click='quickLinkTo("load")'>
                            Load
                        </div>
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