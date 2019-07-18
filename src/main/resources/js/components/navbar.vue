<template>
    <div>
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
    </div>
</template>

<script>
    import {mapState, mapMutations, mapActions} from 'vuex'
    import feedbackModal from '../components/feedbackModal.vue'

    export default {
        name: "languageSelect",
        props: ['getNextQuote'],
        components: {
            feedbackModal
        },
        data() {
            return {
                languageOptions: ['ru', 'en'],
            }
        },
        computed: {
            ...mapState(['user', 'quotesLanguage']),
            ...mapState('quotes', ['selectedRuQuote', 'selectedEngQuote'])
        },
        methods: {
            ...mapMutations(['changeCurrentWikiRefMutation']),
            ...mapActions('quotes', ['changeQuotesLanguageAction']),
            changeQuotesLanguage(newVal) {
                this.changeCurrentWikiRefMutation(newVal)
                this.changeQuotesLanguageAction(newVal)
                if (this.selectedRuQuote === -1 && newVal === 'ru') {
                    this.getNextQuote()
                }
                if (this.selectedEngQuote === -1 && newVal === 'en') {
                    this.getNextQuote()
                }
            },
        }
    }
</script>

<style scoped>

</style>