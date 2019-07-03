import Vue from 'vue'

const forismaticApi = Vue.resource('https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/')

export default {
    get: data => forismaticApi.get(data),
}