import Vue from 'vue'
import Vuex from 'vuex'
import quotes from 'store/modules/quotes'
import createPersistedState from 'vuex-persistedstate'
import * as Cookie from 'js-cookie'


Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        user: userAuth,
        ruWikiRef: 'https://ru.wikipedia.org/wiki/',
        engWikiRef: 'https://en.wikipedia.org/wiki/',
        currentWikiRef: 'https://ru.wikipedia.org/wiki/',
        quotesLanguage: 'ru',
        alwaysDownloadRates: true
    },
    plugins: [
        createPersistedState({
            paths: ['currentWikiRef', 'quotesLanguage', 'alwaysDownloadRates', 'quotes'],
            getState: (key) => Cookie.getJSON(key),
            setState: (key, state) => Cookie.set(key, state, { expires: 1, secure: false })
        })
    ],
    modules: {
        quotes
    },
    getters: {
        userExists: state => (state.user != null)
    },
    mutations: {
        changeQuotesLanguageMutation(state, newLanguage) {
            state.quotesLanguage = newLanguage
        },
        changeCurrentWikiRefMutation(state, newLanguage) {
            if(newLanguage === 'ru') {
                state.currentWikiRef = state.ruWikiRef
            }
            if(newLanguage === 'en'){
                state.currentWikiRef = state.engWikiRef
            }
        },
        changeRatesFlagMutation(state, newVal) {
            state.alwaysDownloadRates = newVal
        }
     },
    actions: {}
})

