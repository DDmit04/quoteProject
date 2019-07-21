<template>
    <div class="container-fluid">
        <navbar/>
        <quote/>
        <quoteRates/>
    </div>
</template>
<script>
    import navbar from '../components/navbar.vue'
    import quote from '../components/quotes.vue'
    import quoteRates from '../components/quoteRates.vue'

    export default {
        components: {
            navbar,
            quote,
            quoteRates
        },
    }
</script>
<style>

</style>