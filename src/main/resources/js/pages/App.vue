<template>
    <div class="container-fluid">
        <nav class='navbar navbar-expand-lg navbar-primary navbar-default bg-light scrolling-navbar shadow'>
            <div class='navbar-nav mr-auto'>
                <li class='nav-item'>
                    <a class="navbar-brand">Quotes</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link"
                       :class="{ 'disabled': quotesLanguage === 'ru'}"
                       href="javascript:void(0)"
                       @click="quotesLanguage = 'ru'">ru</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link"
                       :class="{ 'disabled': quotesLanguage === 'en'}"
                       href="javascript:void(0)"
                       @click="quotesLanguage = 'en'">eng</a>
                </li>
            </div>
            <ul class="nav justify-content-end">
                <feedbackModal/>
            </ul>
        </nav>
            <div class="row mt-2 mx-4">
                <button class="btn btn-primary mt-2"
                        @click="getPervQuote"
                        :disabled="!canPrevQuote">
                    perv quote
                </button>
                <h3 class="col mt-3 mx-4">
                    <b-spinner v-if="loading"></b-spinner>
                    <div v-else-if="appError">
                        что то-то пошло не так, повторите запрос позже
                    </div>
                    <div v-else class="text-area">
                        {{quoteText}}
                        <div>
                            <a :href="wikiRef">
                                <i>{{quoteAuthor}}</i>
                            </a>
                        </div>
                    </div>
                </h3>
                <button class="btn btn-primary mt-2" @click="getNextQuote">next quote</button>
            </div>
    </div>
</template>
<script>
    import forismaticApi from '../api/quotesApi'
    import feedbackModal from '../components/feedbackModal.vue'

    export default {
        data() {
            return {
                ruWikiRef: 'https://ru.wikipedia.org/wiki/',
                engWikiRef: 'https://en.wikipedia.org/wiki/',
                currentWikiRef: 'https://ru.wikipedia.org/wiki/',
                quotesLanguage: 'ru',
                currentSelectedQuote: -1,
                selectedEngQuote: -1,
                selectedRuQuote: -1,
                currentQuotes: [],
                ruQuotes: [],
                engQuotes: [],
                appError: false,
                currentUsedKeys: [],
                usedRuKeys: [],
                usedEngKeys: []
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
            loading: {
                get() { return this.currentQuotes[this.currentSelectedQuote].data == null },
            },
            canPrevQuote: {
                get() {
                    let pervQuoteIndex = this.currentSelectedQuote - 1
                    return pervQuoteIndex >= 0 && this.currentQuotes[pervQuoteIndex] != null
                },
            }
        },
        methods: {
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
            getPervQuote() {
                if(this.canPrevQuote) {
                    this.currentSelectedQuote--
                }
            },
            getNextQuote(){
                this.currentSelectedQuote++
                this.checkQuoteCount()
                if(this.currentQuotes[this.currentSelectedQuote] == null) {
                    this.downloadQuote(this.currentSelectedQuote)
                }
            },
            async downloadQuote(selectedQuote) {
                this.currentQuotes.push ({
                    data: null
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
            },
            randomKey() {
                return Math.floor(Math.random() * 999999)
            },
        }
    }
</script>
<style>

</style>