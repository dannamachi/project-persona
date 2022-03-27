<template>
    <div>
        <button v-if='showingButton' type='button' class='btn btn-info' @click='actionClick()'> {{ getButtonText() }}</button>
    </div>
</template>

<script>
export default {
    props: ['actionType'],
    data() {
        return {
            showingButton: true
        }
    },
    methods: {
        actionClick() {
            
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