<template>
    <div>
        <div class="row mt-2 mx-4">
            <button class="btn btn-primary mt-2"
                    @click="getPervQuote"
                    :disabled="!canPrevQuote">
                perv quote
            </button>
            <h3 class="col mt-3 mx-4">
                <b-spinner v-if="!quoteDataIsReady"></b-spinner>
                <div v-else class="text-area">
                    {{quoteText}}
                    <div>
                        <a :href="wikiRef">
                            <i class="mt-2">{{quoteAuthor}}</i>
                        </a>
                    </div>
                </div>
            </h3>
            <button class="btn btn-primary mt-2" @click="getNextQuote">next quote</button>
        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'

    export default {
        name: "quotes",
        created: function() {
            if(this.quotesLanguage === 'ru') {
                this.loadRuDataMutation()
            } else if(this.quotesLanguage === 'en') {
                this.loadEngDataMutation()
            }
            if(this.currentQuotes.length == 0 && this.currentSelectedQuote == -1) {
                this.getNextQuoteAction()
            }
        },
        computed: {
            ...mapState('quotes', ['currentQuotes', 'currentUsedKeys', 'currentSelectedQuote']),
            ...mapGetters('quotes', ['currentQuote', 'quoteDataIsReady', 'quoteRatesIsReady']),
            quoteAuthor() {
                let author = this.currentQuote.data.quoteAuthor
                if(author === '') {
                    if(this.quotesLanguage === 'ru') {
                        author = 'неизвестный'
                    }
                    if(this.quotesLanguage === 'en') {
                        author = 'unknown'
                    }
                }
                return author
            },
            quoteText() { return this.currentQuote.data.quoteText },
            wikiRef() {
                let author = this.quoteAuthor
                if(author === '' || author === 'неизвестный' || author === 'unknown') {
                    return void(0)
                } else {
                    return this.currentWikiRef + author.split(' ').join('_')
                }
            },
            canPrevQuote() {
                let pervQuoteIndex = this.currentSelectedQuote - 1
                return (pervQuoteIndex >= 0 && this.currentQuotes[pervQuoteIndex] != null)
            }
        },
        methods: {
            ...mapMutations('quotes', ['decrementCurrentSelectedQuoteMutation', 'loadEngDataMutation',
                                        'loadRuDataMutation']),
            ...mapActions('quotes', ['downloadQuoteRatesAction', 'getNextQuoteAction']),
            getNextQuote() {
                this.getNextQuoteAction
            },
            getPervQuote() {
                if(this.canPrevQuote) {
                    this.decrementCurrentSelectedQuoteMutation()
                }
            },
        }
    }
</script>

<style scoped>

</style>