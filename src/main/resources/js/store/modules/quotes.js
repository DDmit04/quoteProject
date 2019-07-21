import forismaticApi from "../../api/quotesApi"
import DBApi from "../../api/ApiQuoteToMyServerApi"
import generateKey from "../../helpers/quoteHelpers"
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
    currentQuote: state => state.currentQuotes[state.currentSelectedQuote],
    quoteDataIsReady: (state, getters) => {
        if(getters.currentQuote != null) {
            return getters.currentQuote.data != null
        } else {
            return false
        }
    },
    quoteRatesIsReady: (state, getters) => {
        if(getters.currentQuote != null) {
            return getters.currentQuote.rates != null
        } else {
            return false
        }
    },
    downloadRatesButtonIsPressed: (state, getters) =>  {
        if(getters.currentQuote != null) {
            return getters.currentQuote.downloadRatesButton
        } else {
            return false
        }
    },

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
    updateQuoteRatesMutation(state, payload) {
        state.currentQuotes[payload.selectedQuote].rates = payload.rates
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
    getNextQuoteAction({state, getters, commit, dispatch}) {
        commit('incrementCurrentSelectedQuoteMutation')
        dispatch('checkQuoteCountAction')
        dispatch('checkUsedKeysCountAction')
        if(getters.currentQuote == null) {
            dispatch('downloadApiQuoteAction', state.currentSelectedQuote)
        }
    },
    async downloadApiQuoteAction({commit, dispatch, rootState}, selectedQuote) {
        commit('pushNewQuoteMutation')
        let key = generateKey(state.currentUsedKeys)
        commit('pushCurrentUsedKeyMutation', key)
        let request = {
            method: 'getQuote',
            key: key,
            format: 'json',
            lang: rootState.quotesLanguage,
        }
        const response = await forismaticApi.get(request)
        const data = await response.json()
        let quoteData = {
            data: data,
            selectedQuote: selectedQuote
        }
        commit('setQuoteDataMutation', quoteData)
        if(rootState.alwaysDownloadRates) {
            await dispatch('downloadQuoteRatesAction', selectedQuote)
        }
    },
    async downloadQuoteRatesAction({state, commit, rootState}, selectedQuote) {
        commit('refreshQuoteRatesMutation')
        let quoteData = state.currentQuotes[selectedQuote].data
        quoteData.quoteLanguage = rootState.quotesLanguage
        const response = await DBApi.save(quoteData)
        const data = await response.json()
        let rates = {
            plusesCount: data.plusesCount,
            mediumCount: data.mediumCount,
            minusesCount: data.minusesCount
        }
        let ratePayload = {
            rates: rates,
            selectedQuote: selectedQuote
        }
        commit('updateQuoteIdMutation', data.quoteId)
        commit('updateQuoteRatesMutation', ratePayload)
    },
    async rateQuoteAction({state, commit, getters}, rateType) {
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
        const response = await method(getters.currentQuote.id)
        const rates = await response.json()
        let ratePayload = {
            rates: rates,
            selectedQuote: state.currentSelectedQuote
        }
        commit('updateQuoteRatesMutation', ratePayload)
    },
    checkPervPushedRateAction({getters, commit}) {
        let pervPushedRate = getters.currentQuote.pushedRate
        let payload = {
            count: -1,
            rateType: pervPushedRate,
        }
        commit('changeQuoteRatesMutation', payload)
    },
    checkQuoteCountAction({state, commit}) {
        if(state.currentQuotes.length > 9) {
            commit('shiftCurrentQuotesMutation')
            commit('decrementCurrentSelectedQuoteMutation')
        }
    },
    checkUsedKeysCountAction({state, commit}) {
        if(state.currentUsedKeys.length > 30) {
            commit('shiftCurrentUsedKeyMutation')
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}