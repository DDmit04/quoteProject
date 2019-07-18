<template>
    <div class="container-fluid">
        <navbar :getNextQuote="getNextQuote"/>
        <quote :getNextQuote="getNextQuote"/>
        <quoteRates/>
    </div>
</template>
<script>
    import { mapState, mapMutations, mapActions, mapGetters} from 'vuex'
    import navbar from '../components/navbar.vue'
    import quote from '../components/quotes.vue'
    import quoteRates from '../components/quoteRates.vue'

    export default {
        components: {
            navbar,
            quote,
            quoteRates
        },
        computed: {
            ...mapState('quotes', ['currentQuotes', 'currentSelectedQuote', 'currentUsedKeys']),
            ...mapGetters('quotes', ['currentQuote']),
        },
        methods: {
            ...mapMutations('quotes', ['decrementCurrentSelectedQuoteMutation', 'incrementCurrentSelectedQuoteMutation',
                                    'pushCurrentUsedKeyMutation', 'shiftCurrentUsedKeyMutation',
                                    'pushNewQuoteMutation', 'shiftCurrentQuotesMutation']),
            ...mapActions('quotes', ['downloadApiQuoteAction']),
            getNextQuote(){
                this.incrementCurrentSelectedQuoteMutation()
                this.checkQuoteCount()
                this.checkUsedKeysCount()
                if(this.currentQuote == null) {
                    this.downloadApiQuote(this.currentSelectedQuote)
                }
            },
            checkQuoteCount() {
                if(this.currentQuotes.length > 9) {
                    this.shiftCurrentQuotesMutation()
                    this.decrementCurrentSelectedQuoteMutation()
                }
            },
            checkUsedKeysCount() {
                if(this.currentUsedKeys.length > 30) {
                    this.shiftCurrentUsedKeyMutation()
                }
            },
            async downloadApiQuote(selectedQuote) {
                this.pushNewQuoteMutation()
                let key = this.generateKey()
                let payload = {
                    key: key,
                    selectedQuote: selectedQuote
                }
                await this.downloadApiQuoteAction(payload)
            },
            generateKey() {
                let generatedKey = Math.floor(Math.random() * 99999)
                if(this.keyIsOriginal(generatedKey)) {
                    this.pushCurrentUsedKeyMutation(generatedKey)
                } else {
                    generatedKey = this.generateKey()
                }
                return generatedKey
            },
            keyIsOriginal(generatedKey) {
                for(let i = 0; i < this.currentUsedKeys.length; i++) {
                    if(this.currentUsedKeys[i] === generatedKey) {
                        return false
                    }
                }
                return true
            }
        }
    }
</script>
<style>

</style>