<template>
    <div class="container-fluid">
        <nav class='navbar navbar-expand-lg navbar-primary navbar-default bg-light scrolling-navbar shadow'>
            <div class='navbar-nav mr-auto'>
                <li class='nav-item'>
                    <a class="navbar-brand">Orderly Chaos</a>
                </li>
            </div>
            <ul class="nav justify-content-end">
<!--                <feedbackModal/>-->
            </ul>
        </nav>
            <div class="row mt-2 mx-4">
                <button class="btn btn-primary mt-2" @click="getPervQuote" :disabled="!canPrevQuote">perv quote</button>
                <h3 class="col mt-3 mx-4">
                    <b-spinner v-if='loading'></b-spinner>
                    <div v-else-if="appError">
                        что то-то пошло не так, повторите запрос позже
                    </div>
                    <div v-else class="text-area">
                        {{quoteText}}
                        @ {{quoteAuthor}}
                    </div>
                </h3>
                <button class="btn btn-primary mt-2" @click="getNextQuote">next quote</button>
            </div>
    </div>
</template>
<script>
    import forismaticApi from '../api/quotesBase'

    export default {
        data() {
            return {
                selectedQuote: -1,
                quotes: [],
                loading: true,
                appError: false
            }
        },
        computed: {
            quoteText: {
                get() {
                    return this.quotes[this.selectedQuote].quoteText
                },
                set() {}
            },
            quoteAuthor: {
                get() {
                    let quoteAuthor = this.quotes[this.selectedQuote].quoteAuthor
                    if(quoteAuthor == '') {
                        quoteAuthor = 'неизвестный'
                    }
                    return quoteAuthor
                },
                set() {}
            },
            canPrevQuote: {
                get() {
                    let pervQuoteIndex = this.selectedQuote - 1
                    return pervQuoteIndex >= 0 && this.quotes[pervQuoteIndex] != null
                },
                set() {}
            }
        },
        mounted: function() {
          this.getNextQuote()
        },
        methods: {
            getPervQuote() {
                if(this.canPrevQuote) {
                    this.selectedQuote--
                }
            },
            async getNextQuote(){
                this.updateCounters()
                if(this.quotes[this.selectedQuote] == null) {
                    this.downloadQuote()
                } else {
                    this.selectedQuote++
                }
            },
            async downloadQuote() {
                const response = await forismaticApi.get({
                    method: 'getQuote',
                    format: 'json',
                    lang: 'ru'
                })
                const data = await response.json()
                this.quotes.push(data)
                this.loading = false
                if (!response.ok) {
                    this.appError = true
                }
            },
            updateCounters() {
                this.selectedQuote++
                this.loading = true
            }
        }
    }
</script>
<style>

</style>