import Vue from 'vue'

const downloadUser = Vue.resource('/quotes/userQuote')
const likeUserQuote = Vue.resource('/quotes/userQuote/plus{/userQuote}')
const medUserQuote = Vue.resource('/quotes/userQuote/medium{/userQuote}')
const minusUserQuote = Vue.resource('/quotes/userQuote/minus{/userQuote}')

export default {
    likeUserQuote: data => likeUserQuote.get({userQuote: data}),
    medUserQuote: data => medUserQuote.get({userQuote: data}),
    minusUserQuote: data => minusUserQuote.get({userQuote: data}),
}