<template>
    <div class='wrapper'>
        <div :class='{
        gameBox: true,
        showLeft: showing == "left",
        showRight: showing == "right",
        showCenter: showing == "center",
        titleBackground: true
        }'>
            <div class='fs-1 text-black'>PROFILE PAGE</div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
/* to do: change profile background or remove */
.titleBackground {
    background-image: url('../assets/backgrounds/bg_flat.png')
}
</style>