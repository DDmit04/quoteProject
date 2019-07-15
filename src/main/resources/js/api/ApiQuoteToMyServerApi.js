import Vue from 'vue'

const downloadApi = Vue.resource('/quotes/apiQuote')
const likeApiQuote = Vue.resource('/quotes/apiQuote/plus{/apiQuote}')
const medApiQuote = Vue.resource('/quotes/apiQuote/medium{/apiQuote}')
const minusApiQuote = Vue.resource('/quotes/apiQuote/minus{/apiQuote}')

export default {
    save: data => downloadApi.save(data),
    plusApiQuote: data => likeApiQuote.get({apiQuote: data}),
    medApiQuote: data => medApiQuote.get({apiQuote: data}),
    minusApiQuote: data => minusApiQuote.get({apiQuote: data})
}