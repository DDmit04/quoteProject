<template>
    <div class="container-fluid">
        <nav class='navbar navbar-expand-lg navbar-primary navbar-default bg-light scrolling-navbar shadow'>
            <div class='navbar-nav mr-auto'>
                <li class='nav-item'>
                    <a class="navbar-brand">Quotes</a>
                </li>
                <li class="nav-item">
                    <b-form-select :value="quotesLanguage"
                                   :options="languageOptions"
                                   @input="changeQuotesLanguage">
                    </b-form-select>
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
                        <button class="btn btn-success btn-lg" @click="rateQuote('plus')">
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
    import {mapState, mapMutations} from 'vuex'

    export default {
        data() {
            return {
                languageOptions: ['ru', 'en'],
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
        computed: {
            ...mapState(['user', 'currentQuotes', 'currentQuotes', 'currentSelectedQuote',
                        'selectedRuQuote', 'selectedEngQuote', 'quotesLanguage']),
            quoteAuthor() {
                let author = this.currentQuotes[this.currentSelectedQuote].data.quoteAuthor
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
            wikiRef() {
                let author = this.currentQuotes[this.currentSelectedQuote].data.quoteAuthor
                if(author === '') {
                    return void(0)
                } else {
                    return this.currentWikiRef + author.split(' ').join('_')
                }
            },
            quoteText() { return  this.currentQuotes[this.currentSelectedQuote].data.quoteText },
            quoteDataIsReady() { return this.currentQuotes[this.currentSelectedQuote].data != null },
            quoteRatesIsReady() { return this.currentQuotes[this.currentSelectedQuote].rates != null },
            downloadRatesButtonIsPressed() { return this.currentQuotes[this.currentSelectedQuote].downloadRatesButton },
            canPrevQuote() {
                let pervQuoteIndex = this.currentSelectedQuote - 1
                return (pervQuoteIndex >= 0 && this.currentQuotes[pervQuoteIndex] != null)
            }
        },
        methods: {
            ...mapMutations(['loadEngDataMutation', 'loadRuDataMutation', 'saveEngDataMutation',
                'saveRuDataMutation', 'decrementCurrentSelectedQuoteMutation',
                'incrementCurrentSelectedQuoteMutation', 'changeQuoteRatesMutation',
                'changeLastPushedRateMutation', 'updateQuoteRateMutation',
                'shiftCurrentQuotesMutation', 'pushNewQuoteMutation', 'setQuoteDataMutation',
                'refreshQuoteRatesMutation', 'updateQuoteIdMutation', 'updateQuoteRatesMutation',
                'changeCurrentWikiRefMutation', 'changeQuotesLanguageMutation']),
            changeQuotesLanguage(newVal) {
                this.changeQuotesLanguageMutation(newVal)
                this.changeCurrentWikiRefMutation(newVal)
                if (newVal === 'ru') {
                    this.saveEngData()
                    this.loadRuData()
                }
                if (newVal === 'en') {
                    this.saveRuData()
                    this.loadEngData()
                }
                if (this.selectedRuQuote === -1 && newVal === 'ru') {
                    this.getNextQuote()
                }
                if (this.selectedEngQuote === -1 && newVal === 'en') {
                    this.getNextQuote()
                }
            },
            checkPervPushedRate() {
                let pervPushedRate = this.currentQuotes[this.currentSelectedQuote].pushedRate
                if(pervPushedRate === 'plus') {
                    let payload = {
                        count: -1,
                        rateType: pervPushedRate,
                    }
                    this.changeQuoteRatesMutation(payload)
                } else if(pervPushedRate === 'medium') {
                    let payload = {
                        count: -1,
                        rateType: pervPushedRate,
                    }
                    this.changeQuoteRatesMutation(payload)
                } else if(pervPushedRate === 'minus') {
                    let payload = {
                        count: -1,
                        rateType: pervPushedRate,
                    }
                    this.changeQuoteRatesMutation(payload)
                }
            },
            async rateQuote(rateType) {
                let method
                if(rateType === 'plus') {
                    this.checkPervPushedRate()
                    let payload = {
                        count: 1,
                        rateType: rateType,
                    }
                    this.changeQuoteRatesMutation(payload)
                    this.changeLastPushedRateMutation(rateType)
                    method = DBApi.plusApiQuote
                } else if(rateType === 'medium') {
                    this.checkPervPushedRate()
                    let payload = {
                        count: 1,
                        rateType: rateType,
                    }
                    this.changeQuoteRatesMutation(payload)
                    this.changeLastPushedRateMutation(rateType)
                    method = DBApi.medApiQuote
                } else if(rateType === 'minus') {
                    this.checkPervPushedRate()
                    let payload = {
                        count: 1,
                        rateType: rateType,
                    }
                    this.changeQuoteRatesMutation(payload)
                    this.changeLastPushedRateMutation(rateType)
                    method = DBApi.minusApiQuote
                } else {
                    console.error('unknown rates type - ' + rateType)
                }
                const response = await method(this.currentQuotes[this.currentSelectedQuote].id)
                const rates = await response.json()
                this.updateQuoteRateMutation(rates)
            },
            saveEngData() {
                this.saveEngDataMutation()
            },
            loadEngData() {
                this.loadEngDataMutation()
            },
            saveRuData() {
                this.saveRuDataMutation()
            },
            loadRuData() {
                this.loadRuDataMutation()
            },
            checkQuoteCount() {
                if(this.currentQuotes.length > 9) {
                    this.shiftCurrentQuotesMutation()
                    this.decrementCurrentSelectedQuoteMutation()
                }
            },
            checkUsedKeysCount() {
                if(this.currentUsedKeys.length > 30) {
                    this.currentUsedKeys.shift()
                }
            },
            getPervQuote() {
                if(this.canPrevQuote) {
                    this.decrementCurrentSelectedQuoteMutation()
                }
            },
            getNextQuote(){
                this.incrementCurrentSelectedQuoteMutation()
                this.checkQuoteCount()
                this.checkUsedKeysCount()
                if(this.currentQuotes[this.currentSelectedQuote] == null) {
                    this.downloadApiQuote(this.currentSelectedQuote)
                }
            },
            async downloadApiQuote(selectedQuote) {
                let quote = {
                    data: null,
                    rates: null,
                    pushedRate: null,
                    id: null,
                    downloadRatesButton: false
                }
                this.pushNewQuoteMutation(quote)
                let request = {
                    method: 'getQuote',
                    format: 'json',
                    lang: this.quotesLanguage,
                    key: this.generateKey()
                }
                console.log(this.quotesLanguage)
                const response = await forismaticApi.get(request)
                const data = await response.json()
                let payload = {
                    data: data,
                    selectedQuote: selectedQuote
                }
                this.setQuoteDataMutation(payload)
                if(this.alwaysDownloadRates) {
                    await this.downloadQuoteRates()
                }
            },
            async downloadQuoteRates() {
                this.refreshQuoteRatesMutation()
                let quoteData = this.currentQuotes[this.currentSelectedQuote].data
                quoteData.quoteLanguage = this.quotesLanguage
                const response = await DBApi.save(quoteData)
                const data = await response.json()
                this.updateQuoteIdMutation(data.quoteId)
                let rates = {
                    plusesCount: data.plusesCount,
                    mediumCount: data.mediumCount,
                    minusesCount: data.minusesCount
                }
                this.updateQuoteRatesMutation(rates)
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