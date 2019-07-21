<template>
    <div class="row">
        <div class="col mt-2 text-center">
            <button class="btn btn-primary btn-block my-2"
                    v-if="!alwaysDownloadRates"
                    @click="downloadQuoteRatesAction(currentSelectedQuote)"
                    :disabled="!quoteDataIsReady">
                <div v-if="!quoteRatesIsReady">
                    download rates
                </div>
                <div v-else>
                    update rates
                </div>
            </button>
            <div v-if="(!alwaysDownloadRates && downloadRatesButtonIsPressed) || alwaysDownloadRates">
                <b-spinner type="grow" v-if="!quoteRatesIsReady"></b-spinner>
                <div v-else>
                    <button :disabled="!userExists" class="btn btn-success btn-lg" @click="rateQuote('plus')">
                        like
                        <span class="badge badge-light">
                                {{quotePluses}}
                            </span>
                    </button>
                    <button :disabled="!userExists" class="btn btn-warning btn-lg" @click="rateQuote('medium')">
                        medium
                        <span class="badge badge-light">
                                {{quoteMedium}}
                            </span>
                    </button>
                    <button :disabled="!userExists" class="btn btn-danger btn-lg" @click="rateQuote('minus')">
                        minus
                        <span class="badge badge-light">
                                {{quoteMinuses}}
                            </span>
                    </button>
                    <b-form-checkbox class="mt-2" v-model="alwaysDownloadRates">
                        always download rates
                    </b-form-checkbox>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions, mapGetters, mapMutations} from 'vuex'

    export default {
        name: "quoteRates",
        computed: {
            ...mapState('quotes', ['currentQuotes', 'currentSelectedQuote']),
            ...mapGetters(['userExists']),
            ...mapGetters('quotes', ['currentQuote', 'quoteDataIsReady',
                                    'quoteRatesIsReady', 'downloadRatesButtonIsPressed']),
            quotePluses() { return this.currentQuotes[this.currentSelectedQuote].rates.plusesCount },
            quoteMedium() { return this.currentQuotes[this.currentSelectedQuote].rates.mediumCount },
            quoteMinuses() { return this.currentQuotes[this.currentSelectedQuote].rates.minusesCount },
            alwaysDownloadRates: {
                get() { return this.$store.state.alwaysDownloadRates },
                set(newVal) { this.changeRatesFlagMutation(newVal) }
            },
        },
        methods: {
            ...mapActions('quotes', ['downloadQuoteRatesAction',
                                        'checkPervPushedRateAction',
                                        'pushNewQuoteMutation', 'rateQuoteAction']),
            ...mapMutations(['changeRatesFlagMutation']),
            rateQuote(rateType) {
                this.checkPervPushedRateAction()
                this.rateQuoteAction(rateType)
            },
        }
    }
</script>

<style scoped>

</style>