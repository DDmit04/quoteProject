import Vue from 'vue'
import Vuex from 'vuex'
import userStore from 'store/modules/userStore'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: userAuth,
        currentQuotes: [],
        ruQuotes: [],
        engQuotes: [],
        currentSelectedQuote: -1,
        selectedEngQuote: -1,
        selectedRuQuote: -1,
        ruWikiRef: 'https://ru.wikipedia.org/wiki/',
        engWikiRef: 'https://en.wikipedia.org/wiki/',
        currentWikiRef: 'https://ru.wikipedia.org/wiki/',
        quotesLanguage: 'ru',
    },
    modules: {
        userStore
    },
    getters: {

    },
    mutations: {
        changeQuotesLanguageMutation(state, newLanguage) {
            state.quotesLanguage = newLanguage
        },
        saveEngDataMutation(state) {
            state.selectedEngQuote = state.currentSelectedQuote
            state.engQuotes = state.currentQuotes
            state.usedEngKeys = state.currentUsedKeys
        },
        loadEngDataMutation(state) {
            state.currentSelectedQuote = state.selectedEngQuote
            state.currentQuotes = state.engQuotes
            state.currentUsedKeys = state.usedEngKeys
        },
        saveRuDataMutation(state) {
            state.selectedRuQuote = state.currentSelectedQuote
            state.ruQuotes = state.currentQuotes
            state.usedRuKeys = state.currentUsedKeys
        },
        loadRuDataMutation(state) {
            state.currentSelectedQuote = state.selectedRuQuote
            state.currentQuotes = state.ruQuotes
            state.currentUsedKeys = state.usedRuKeys
        },
        incrementCurrentSelectedQuoteMutation(state) {
            state.currentSelectedQuote++
        },
        decrementCurrentSelectedQuoteMutation(state) {
            state.currentSelectedQuote--
        },
        changeQuoteRatesMutation(state, payload) {
            let rateType = payload.rateType
            let count = payload.count
            if(rateType === 'plus') {
                state.currentQuotes[state.currentSelectedQuote].rates.plusesCount + count
            } else if(rateType === 'medium') {
                state.currentQuotes[state.currentSelectedQuote].rates.mediumCount + count
            } else if(rateType === 'minus') {
                state.currentQuotes[state.currentSelectedQuote].rates.minusesCount + count
            }
        },
        changeLastPushedRateMutation(state, pushedRate) {
            state.currentQuotes[state.currentSelectedQuote].pushedRate = pushedRate
        },
        updateQuoteRateMutation(state, rates) {
            state.currentQuotes[state.currentSelectedQuote].rates = rates
        },
        shiftCurrentQuotesMutation(state) {
            state.currentQuotes.shift()
        },
        pushNewQuoteMutation(state, quote) {
            state.currentQuotes.push(quote)
        },
        setQuoteDataMutation(state, payload) {
            state.currentQuotes[payload.selectedQuote].data = payload.data
        },
        refreshQuoteRatesMutation(state) {
            state.currentQuotes[state.currentSelectedQuote].downloadRatesButton = true
            state.currentQuotes[state.currentSelectedQuote].rates = null
        },
        updateQuoteRatesMutation(state, rates) {
            state.currentQuotes[state.currentSelectedQuote].rates = rates
        },
        updateQuoteIdMutation(state, id) {
            state.currentQuotes[state.currentSelectedQuote].id = id
        },
        changeCurrentWikiRefMutation(state, newLanguage) {
            if(newLanguage === 'ru') {
                state.currentWikiRef = state.ruWikiRef
            }
            if(newLanguage === 'en'){
                state.currentWikiRef = state.engWikiRef
            }
        }
     },
    actions: {}
})

