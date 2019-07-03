<template>
    <div class="container-fluid">
        <nav class='navbar navbar-expand-lg navbar-primary navbar-default bg-light scrolling-navbar shadow'>
            <div class='navbar-nav mr-auto'>
                <li class='nav-item'>
                    <a class="navbar-brand">Orderly Chaos</a>
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
                            @ {{quoteAuthor}}
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
                selectedQuote: -1,
                quotes: [],
                appError: false
            }
        },
        components: {
            feedbackModal
        },
        computed: {
            quoteText: {
                get() {
                    return this.quotes[this.selectedQuote].data.quoteText
                }
            },
            quoteAuthor: {
                get() {
                    let author = this.quotes[this.selectedQuote].data.quoteAuthor
                    if(author == '') {
                        author = 'неизвестный'
                    }
                    return author
                },
            },
            loading: {
                get() {
                    return this.quotes[this.selectedQuote].data == null
                },
            },
            canPrevQuote: {
                get() {
                    let pervQuoteIndex = this.selectedQuote - 1
                    return pervQuoteIndex >= 0 && this.quotes[pervQuoteIndex] != null
                },
            }
        },
        created: function() {
          this.getNextQuote()
        },
        methods: {
            checkQuoteCount() {
                if(this.quotes.length > 9) {
                    this.quotes.shift()
                    this.selectedQuote--
                }
            },
            getPervQuote() {
                if(this.canPrevQuote) {
                    this.selectedQuote--
                }
            },
            getNextQuote(){
                this.selectedQuote++
                this.checkQuoteCount()
                if(this.quotes[this.selectedQuote] == null) {
                    this.downloadQuote(this.selectedQuote)
                }
            },
            async downloadQuote(selectedQuote) {
                let key = this.randomKey()
                this.quotes.push ({
                    data: null
                })
                let request = {
                        method: 'getQuote',
                        format: 'json',
                        lang: 'ru',
                        key: key
                }
                const response = await forismaticApi.get(request)
                const data = await response.json()
                this.quotes[selectedQuote].data = data
            },
            randomKey() {
                return Math.floor(Math.random() * 999999)
            },
        }
    }
</script>
<style>

</style>