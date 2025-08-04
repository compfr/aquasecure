<template>
    <div v-if="show">
        <b-card>
            <b-row>
                <b-col md="4" class="mb-2">
                    <h5>Name</h5>
                    <b-card-text>{{model.name}}</b-card-text>
                </b-col>
                <b-col md="4" class="mb-2">
                    <h5>Label</h5>
                    <b-card-text>{{model.label.name}}</b-card-text>
                </b-col>
                <b-col md="4" class="mb-2">
                    <h5>URL</h5>
                    <b-card-text>{{model.label.base_url}}:{{model.label.port}}</b-card-text>
                </b-col>
                <b-col md="8" class="mb-2">
                    <h5>Search Query</h5>
                    <b-card-text>{{model.search_query}}</b-card-text>
                </b-col>
                <b-col md="4" class="mb-2">
                    <h5>Search Time</h5>
                    <b-card-text>{{model.earliest_time}}</b-card-text>
                </b-col>
            </b-row>
        </b-card>
        <b-card>
            <b-row v-if="showResult">

                <b-col cols="6" class="mb-0 d-flex align-items-center">
                    <h4>Total Events {{ totalEvents | formatNum }}</h4>
                </b-col>
                <b-col cols="6" class="d-flex align-items-center justify-content-end mb-2">
<!--                    <b-button v-b-toggle.sidebar-backdrop class="mr-1" variant="primary">-->
<!--                        <feather-icon icon="GridIcon" size="14"/>-->
<!--                        Add Fields ({{ this.eventData.fields.length }})-->
<!--                    </b-button>-->
                    <h5 class="mr-1 mb-0">Total Pages : {{ Math.ceil(this.totalEvents / 50) | formatNum }}</h5>
                    <b-button

                        type="submit"
                        variant="primary"
                        :disabled="this.offset == 0 ? true : false"
                        @click="prevPage"
                    >
                        <feather-icon
                            icon="ChevronLeftIcon"
                            size="18"
                        />
                    </b-button>
                    <h5 class="mx-1">{{ this.currentPage }}</h5>
                    <b-button

                        type="submit"
                        variant="primary"
                        :disabled="(this.offset+this.eventData.results.length) == this.totalEvents ? true : false"
                        @click="nextPage"
                    >
                        <feather-icon
                            icon="ChevronRightIcon"
                            size="18"
                        />
                    </b-button>
                </b-col>
                <b-col cols="12" class="table-responsive">
                    <div class="custom_heights_table scroll-container">
                        <table class="table table-striped table-hover">
                            <thead class="Sticky_Row">
                            <template v-for="(item ,index) in model.columns">
                                <th>{{ item }}</th>
                            </template>
                            </thead>
                            <tbody>
                            <template v-for="(event, index) in eventData.results">
                                <tr>
                                    <template v-for="(field, fIndex) in model.columns">
                                        <td>{{ event[field] }}</td>
                                    </template>
                                </tr>
                            </template>
                            </tbody>
                        </table>
                    </div>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BCardText,
        BRow,
        BCol,
        BButton,
        BBadge
    } from 'bootstrap-vue'
    import {get, post} from '@/libs/api'
    import {form} from "@/libs/mixins";

    export default {
        name: "ShowReport",
        components: {
            BCard,
            BCardText,
            BRow,
            BCol,
            BButton,
            BBadge
        },
        mixins: [form],
        props: {
            formId: Number
        },
        data() {
            return {
                show: false,
                model: null,
                showResult: false,
                eventData: null,
                totalEvents: 0,
                job_id: '',
                offset: 0,
                currentPage: 1,
            }
        },
    created() {
        get(`/api/reports/${this.formId}`).then((res) => {
            Vue.set(this.$data, 'model', res.data.model);
            this.show = true
            if(this.model.label.api_type_id == 1){
                this.splunkApi()
            }
        });
    },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            cancelForm() {
                this.$emit('cancel');
            },

            splunkApi(){
                this.openLoading();
                post(`/api/get_splunk_api`, this.model).then((res) => {
                    Vue.set(this.$data, 'eventData', res.data.events);
                    Vue.set(this.$data, 'totalEvents', res.data.total_events);
                    Vue.set(this.$data, 'job_id', res.data.job_id);

                    this.offset = 0;
                    this.currentPage = 1;
                    this.showResult = true
                    this.closeLoading();
                }).catch((e)=>{
                    this.closeLoading();
                });
            },
            nextPage() {
                let queryObj = {
                    offset: this.offset + 50,
                    count: 50,
                    job_id: this.job_id,
                    id: this.formId
                };

                post(`/api/get_splunk_api_pagination`, queryObj).then((res) => {
                    Vue.set(this.$data, 'eventData', res.data.events);
                    this.offset = this.offset + 50;
                    this.currentPage += 1;
                });
            },

            prevPage() {
                let queryObj = {
                    offset: this.offset - 50,
                    count: 50,
                    job_id: this.job_id,
                    id: this.formId
                };

                post(`/api/get_splunk_api_pagination`, queryObj).then((res) => {
                    Vue.set(this.$data, 'eventData', res.data.events);
                    this.offset = this.offset - 50;
                    this.currentPage -= 1;
                });
            },
        }
    }
</script>

<style scoped>
    .Sticky_Row {
        position: sticky;
        top: -1px;
    }

    .custom_heights_table {
        height: 55vh !important;
    }

    .scroll-container {
        height: 300px;
        overflow-y: scroll;
    }

    .scroll-container::-webkit-scrollbar {
        width: 5px;
        height: 8px;
        /*border-radius: 5px;*/
    }

    .scroll-container::-webkit-scrollbar-track {

        background: #FFF;
        border-radius: 2px;
    }

    .scroll-container::-webkit-scrollbar-thumb {
        background: #343434;

        border-radius: 2px;
    }

    .scroll-container::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    .scroll-container::-webkit-scrollbar-button {
        display: none;
    }
</style>
