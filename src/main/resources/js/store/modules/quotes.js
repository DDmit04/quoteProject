import forismaticApi from "../../api/quotesApi";
import DBApi from "../../api/ApiQuoteToMyServerApi";

const state = {
    currentQuotes: [],
    ruQuotes: [],
    engQuotes: [],
    
    currentSelectedQuote: -1,
    selectedEngQuote: -1,
    selectedRuQuote: -1,
    
    currentUsedKeys: [],
    usedRuKeys: [],
    usedEngKeys: [],
}
const getters = {
    currentQuote: state => state.currentQuotes[state.currentSelectedQuote]
}
const mutations = {
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
    shiftCurrentQuotesMutation(state) {
        state.currentQuotes.shift()
    },
    shiftCurrentUsedKeyMutation(state) {
        state.currentUsedKeys.shift()
    },
    pushNewQuoteMutation(state) {
        let quote = {
            id: null,
            data: null,
            rates: null,
            pushedRate: null,
            downloadRatesButton: false
        }
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
    pushCurrentUsedKeyMutation(state, generatedKey) {
        state.currentUsedKeys.push(generatedKey)
    }
}
const actions = {
    changeQuotesLanguageAction({state, commit}, newLanguage) {
        commit('changeQuotesLanguageMutation', newLanguage, {root: true})
        if (newLanguage === 'ru') {
            commit('saveEngDataMutation')
            commit('loadRuDataMutation')
        }
        if (newLanguage === 'en') {
            commit('saveRuDataMutation')
            commit('loadEngDataMutation')
        }
    },
    async downloadApiQuoteAction({commit, dispatch, rootState}, payload) {
        let request = {
            method: 'getQuote',
            format: 'json',
            lang: rootState.quotesLanguage,
            key: payload.key
        }
        const response = await forismaticApi.get(request)
        const data = await response.json()
        let quoteData = {
            data: data,
            selectedQuote: payload.selectedQuote
        }
        commit('setQuoteDataMutation', quoteData)
        if(rootState.alwaysDownloadRates) {
            dispatch('downloadQuoteRatesAction')
        }
    },
    async downloadQuoteRatesAction({state, commit, rootState}) {
        commit('refreshQuoteRatesMutation')
        let quoteData = state.currentQuotes[state.currentSelectedQuote].data
        quoteData.quoteLanguage = rootState.quotesLanguage
        const response = await DBApi.save(quoteData)
        const data = await response.json()
        let rates = {
            plusesCount: data.plusesCount,
            mediumCount: data.mediumCount,
            minusesCount: data.minusesCount
        }
        commit('updateQuoteIdMutation', data.quoteId)
        commit('updateQuoteRatesMutation', rates)
    },
    async rateQuoteAction({state, commit}, rateType) {
        let method
        let payload = {
            count: 1,
            rateType: rateType,
        }
        commit('changeQuoteRatesMutation', payload)
        commit('changeLastPushedRateMutation', rateType)
        if(rateType === 'plus') {
            method = DBApi.plusApiQuote
        } else if(rateType === 'medium') {
            method = DBApi.medApiQuote
        } else if(rateType === 'minus') {
            method = DBApi.minusApiQuote
        } else {
            console.error('unknown rates type - ' + rateType)
        }
        const response = await method(state.currentQuotes[state.currentSelectedQuote].id)
        const rates = await response.json()
        commit('updateQuoteRatesMutation', rates)
    },
    checkPervPushedRateAction({state, commit}) {
        let pervPushedRate = state.currentQuotes[state.currentSelectedQuote].pushedRate
        let payload = {
            count: -1,
            rateType: pervPushedRate,
        }
        commit('changeQuoteRatesMutation', payload)
    },

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}