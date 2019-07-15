<template>
    <div class="container-fluid">
        <nav class='navbar navbar-expand-lg navbar-primary navbar-default bg-light scrolling-navbar shadow'>
            <div class='navbar-nav mr-auto'>
                <li class='nav-item'>
                    <a class="navbar-brand">Quotes</a>
                </li>
                <li class="nav-item">
                    <b-form-select v-model="quotesLanguage" :options="languageOptions"></b-form-select>
                </li>
            </div>
            <ul class="nav justify-content-end">
                <li clas="nav-item">
                    <feedbackModal/>
                </li>
                <li clas="nav-item">
                    <div class="navbar-text">
                        <div v-if="user == null">
                            unknown
                            <a href="/login">login</a>
                        </div>
                        <div v-else>
                            {{user.name}}
                            <a href="/logout">logout</a>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
        <div class="row mt-2 mx-4">
            <button class="btn btn-primary mt-2"
                    @click="getPervQuote"
                    :disabled="!canPrevQuote">
                perv quote
            </button>
            <h3 class="col mt-3 mx-4">
                <b-spinner v-if="!quoteDataIsReady"></b-spinner>
                <div v-else-if="appError">
                    something go wrong :(
                </div>
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
        <div class="row">
            <div class="col mt-2 text-center">
                <button class="btn btn-primary btn-block my-2"
                        v-if="!alwaysDownloadRates"
                        @click="downloadQuoteRates()"
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
                        <button class="btn btn-success btn-lg" @click="rateQuote('like')">
                            like
                            <span class="badge badge-light">
                                {{currentQuotes[currentSelectedQuote].rates.plusesCount}}
                            </span>
                        </button>
                        <button class="btn btn-warning btn-lg" @click="rateQuote('medium')">
                            medium
                            <span class="badge badge-light">
                                {{currentQuotes[currentSelectedQuote].rates.mediumCount}}
                            </span>
                        </button>
                        <button class="btn btn-danger btn-lg" @click="rateQuote('minus')">
                            minus
                            <span class="badge badge-light">
                                {{currentQuotes[currentSelectedQuote].rates.minusesCount}}
                            </span>
                        </button>
                        <b-form-checkbox class="mt-2" v-model="alwaysDownloadRates">
                            always download rates
                        </b-form-checkbox>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import forismaticApi from '../api/quotesApi'
    import DBApi from '../api/ApiQuoteToMyServerApi'
    import feedbackModal from '../components/feedbackModal.vue'
    import {mapState} from 'vuex'

    export default {
        data() {
            return {
                ruWikiRef: 'https://ru.wikipedia.org/wiki/',
                engWikiRef: 'https://en.wikipedia.org/wiki/',
                currentWikiRef: 'https://ru.wikipedia.org/wiki/',
                quotesLanguage: 'ru',
                languageOptions: ['ru', 'en'],
                currentSelectedQuote: -1,
                selectedEngQuote: -1,
                selectedRuQuote: -1,
                currentQuotes: [],
                ruQuotes: [],
                engQuotes: [],
                appError: false,
                currentUsedKeys: [],
                usedRuKeys: [],
                usedEngKeys: [],
                alwaysDownloadRates: true
            }
        },
        components: {
            feedbackModal
        },
        created: function() {
            if(this.quotesLanguage === 'ru') {
                this.loadRuData()
            } else if(this.quotesLanguage === 'en') {
                this.loadEngData()
            }
            this.getNextQuote()
        },
        watch: {
            quotesLanguage(newVal) {
                if(newVal === 'ru') {
                    this.currentWikiRef = this.ruWikiRef
                    this.saveEngData()
                    this.loadRuData()
                } else if(newVal === 'en'){
                    this.currentWikiRef = this.engWikiRef
                    this.saveRuData()
                    this.loadEngData()
                }
                if(this.selectedRuQuote === -1 && newVal === 'ru') {
                    this.getNextQuote()
                }
                if(this.selectedEngQuote === -1 && newVal === 'en') {
                    this.getNextQuote()
                }
            }
        },
        computed: {
            ...mapState(['user']),
            wikiRef: {
                get() {
                    let author = this.currentQuotes[this.currentSelectedQuote].data.quoteAuthor
                    if(author === '') {
                        return void(0)
                    } else {
                        return this.currentWikiRef + author.split(' ').join('_')
                    }
                },
            },
            quoteText: {
                get() { return this.currentQuotes[this.currentSelectedQuote].data.quoteText }
            },
            quoteAuthor: {
                get() {
                    let author = this.currentQuotes[this.currentSelectedQuote].data.quoteAuthor
                    if(author === '') {
                        author = 'неизвестный'
                    }
                    return author
                },
            },
            quoteDataIsReady: {
                get() { return this.currentQuotes[this.currentSelectedQuote].data != null },
            },
            quoteRatesIsReady: {
                get() { return this.currentQuotes[this.currentSelectedQuote].rates != null },
            },
            downloadRatesButtonIsPressed: {
                get() { return this.currentQuotes[this.currentSelectedQuote].downloadRatesButton }
            },
            canPrevQuote: {
                get() {
                    let pervQuoteIndex = this.currentSelectedQuote - 1
                    return (pervQuoteIndex >= 0 && this.currentQuotes[pervQuoteIndex] != null)
                },
            }
        },
        methods: {
            checkPervPushedRate() {
                let pervPushedRate = this.currentQuotes[this.currentSelectedQuote].pushedRate
                if(pervPushedRate === 'like') {
                    this.currentQuotes[this.currentSelectedQuote].rates.plusesCount--
                } else if(pervPushedRate === 'medium') {
                    this.currentQuotes[this.currentSelectedQuote].rates.mediumCount--
                } else if(pervPushedRate === 'minus') {
                    this.currentQuotes[this.currentSelectedQuote].rates.minusesCount--
                }
            },
            async rateQuote(rateType) {
                let method
                if(rateType === 'like') {
                    this.checkPervPushedRate()
                    this.currentQuotes[this.currentSelectedQuote].rates.plusesCount++
                    this.currentQuotes[this.currentSelectedQuote].pushedRate = 'like'
                    method = DBApi.plusApiQuote
                } else if(rateType === 'medium') {
                    this.checkPervPushedRate()
                    this.currentQuotes[this.currentSelectedQuote].rates.mediumCount++
                    this.currentQuotes[this.currentSelectedQuote].pushedRate = 'medium'
                    method = DBApi.medApiQuote
                } else if(rateType === 'minus') {
                    this.checkPervPushedRate()
                    this.currentQuotes[this.currentSelectedQuote].rates.minusesCount++
                    this.currentQuotes[this.currentSelectedQuote].pushedRate = 'minus'
                    method = DBApi.minusApiQuote
                } else {
                    console.error('unknown rates type - ' + rateType)
                }
                const response = await method(this.currentQuotes[this.currentSelectedQuote].id)
                const rates = await response.json()
                this.currentQuotes[this.currentSelectedQuote].rates = rates
            },
            saveEngData() {
                this.selectedEngQuote = this.currentSelectedQuote
                this.engQuotes = this.currentQuotes
                this.usedEngKeys = this.currentUsedKeys
            },
            loadEngData() {
                this.currentSelectedQuote = this.selectedEngQuote
                this.currentQuotes = this.engQuotes
                this.currentUsedKeys = this.usedEngKeys
            },
            saveRuData() {
                this.selectedRuQuote = this.currentSelectedQuote
                this.ruQuotes = this.currentQuotes
                this.usedRuKeys = this.currentUsedKeys
            },
            loadRuData() {
                this.currentSelectedQuote = this.selectedRuQuote
                this.currentQuotes = this.ruQuotes
                this.currentUsedKeys = this.usedRuKeys
            },
            checkQuoteCount() {
                if(this.currentQuotes.length > 9) {
                    this.currentQuotes.shift()
                    this.currentSelectedQuote--
                }
            },
            checkUsedKeysCount() {
                if(this.currentUsedKeys.length > 30) {
                    this.currentUsedKeys.shift()
                }
            },
            getPervQuote() {
                if(this.canPrevQuote) {
                    this.currentSelectedQuote--
                }
            },
            getNextQuote(){
                this.currentSelectedQuote++
                this.checkQuoteCount()
                this.checkUsedKeysCount()
                if(this.currentQuotes[this.currentSelectedQuote] == null) {
                    this.downloadApiQuote(this.currentSelectedQuote)
                }
            },
            async downloadApiQuote(selectedQuote) {
                this.currentQuotes.push ({
                    data: null,
                    rates: null,
                    pushedRate: null,
                    id: null,
                    downloadRatesButton: false
                })
                let request = {
                    method: 'getQuote',
                    format: 'json',
                    lang: this.quotesLanguage,
                    key: this.generateKey()
                }
                const response = await forismaticApi.get(request)
                const data = await response.json()
                this.currentQuotes[selectedQuote].data = data
                if(this.alwaysDownloadRates) {
                    await this.downloadQuoteRates()
                }
            },
            async downloadQuoteRates() {
                this.currentQuotes[this.currentSelectedQuote].downloadRatesButton = true
                this.currentQuotes[this.currentSelectedQuote].rates = null
                let quoteData = this.currentQuotes[this.currentSelectedQuote].data
                quoteData.quoteLanguage = this.quotesLanguage
                const response = await DBApi.save(quoteData)
                const data = await response.json()
                this.currentQuotes[this.currentSelectedQuote].id = data.quoteId
                let metrics = {
                    plusesCount: data.plusesCount,
                    mediumCount: data.mediumCount,
                    minusesCount: data.minusesCount
                }
                this.currentQuotes[this.currentSelectedQuote].rates = metrics
            },
            generateKey() {
                let generatedKey = Math.floor(Math.random() * 99999)
                if(this.keyIsOriginal(generatedKey)) {
                    this.currentUsedKeys.push(generatedKey)
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