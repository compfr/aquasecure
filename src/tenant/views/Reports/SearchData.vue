<template>
    <div>
        <b-card>
            <b-row>
                <b-col md="1" class="d-flex justify-content-center" v-if="selectedApiType">
                    <b-img :src="selectedApiType.logo" height="60" width="60"/>
                </b-col>
                <b-col md="3">
                    <b-form-group
                        label="Label"
                    >
                        <x-tag-input :position-relative="true" :value="searchObj.label" :resource="`/api/search/labels`"
                                     column="name" name="name" @input="onLabelUpd"/>
                    </b-form-group>
                </b-col>
                <b-col md="5" v-if="selectedApiType">
                    <b-form-group
                        label="Category"
                    >
                        <x-tag-input :positionRelative="true" :removable="true" keyIndex="category_id"
                                     :multiple="true" :value="categories" relation="category"
                                     :resource="`/api/search/use_case_library_categories`" column="title" name="title"
                                     @input="onCategoryUpdate">
                        </x-tag-input>
                    </b-form-group>
                </b-col>
                <b-col md="3" v-if="selectedApiType">
                    <b-form-group
                        label="Use Case"
                    >
                        <x-tag-input :position-relative="true" :value="selectedUseCase"
                                     :resource="`/api/search/use_case_libraries`" :params="useCaseAdditionalParams"
                                     column="title" name="title" @input="onUseCaseUpdate"/>
                    </b-form-group>
                </b-col>
                <b-col cols="11">
                    <b-form-group label="Search">
                        <b-input-group>
                            <b-form-input v-model="searchObj.input" placeholder="search here"/>
                            <template #append>
                                <b-form-select v-model="searchObj.earliest_time" :options="timeOptions"/>
                                <b-button

                                    type="submit"
                                    variant="primary"
                                    @click="searchResult"
                                >
                                    <feather-icon icon="SearchIcon" size="14"/>
                                </b-button>
                            </template>
                        </b-input-group>
                    </b-form-group>
                </b-col>

                <b-col cols="1" class="d-flex align-items-center">
                    <b-button v-if="show && eventData && eventData.results.length > 0"

                              type="submit"
                              variant="primary"
                              class="mr-1"
                              @click="addReport"
                    >
                        <feather-icon icon="FileIcon" size="14"/>
                    </b-button>
                </b-col>
            </b-row>
            <b-row v-if="show">

                <b-col cols="6" class="mb-0 d-flex align-items-center">
                    <h4>Total Events {{ totalEvents | formatNum }}</h4>
                </b-col>
                <b-col cols="6" class="d-flex align-items-center justify-content-end mb-2">
                    <b-button v-b-toggle.sidebar-backdrop class="mr-1" variant="primary">
                        <feather-icon icon="GridIcon" size="14"/>
                        Add Fields ({{ this.eventData.fields.length }})
                    </b-button>
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
                            <th>Label</th>
                            <template v-for="(item ,index) in selectedFields">
                                <th>{{ item }}</th>
                            </template>
                            </thead>
                            <tbody>
                            <template v-for="(event, index) in eventData.results">
                                <tr>
                                    <td style="width: 15%">{{ selectedLabel }}</td>
                                    <template v-for="(field, fIndex) in selectedFields">
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

        <b-sidebar id="sidebar-backdrop"
                   backdrop-variant="dark"
                   backdrop title="Select Fields" right shadow v-if="show">
            <div class="px-1 py-2">
                <template v-for="(item, index) in eventData.fields">
                    <div>
                        <b-form-checkbox
                            :id="`checkbox-${index}`"
                            :value="item.name"
                            v-model="selectedFields"
                            :disabled="alwaysFields.includes(item.name) ? true : false"
                        >
                            {{ item.name }}
                        </b-form-checkbox>
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-modal
            v-model="reportModal"
            id="modal-framework-type"
            title="Add Report"
            ok-title="Submit"
            size="lg"
            cancel-variant="outline-secondary"
            @hidden="resetReportModal"
            @ok="submitReport">

            <b-row>
                <b-col md="6">
                    <b-form-group
                        label="Name"
                    >
                        <b-form-input
                            placeholder="Name"
                            v-model="reportForm.name"
                        />
                        <error :error="reportError.name"/>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group
                        label="Description"
                    >
                        <b-form-input
                            placeholder="Description"
                            v-model="reportForm.desc"
                        />
                        <error :error="reportError.desc"/>
                    </b-form-group>
                </b-col>

                <b-col md="12">
                    <b-form-group
                        label="Search Query"
                    >
                        <b-form-input
                            placeholder="Search"
                            v-model="reportForm.search_query"
                        />
                        <error :error="reportError.search_query"/>
                    </b-form-group>
                </b-col>
                <b-col cols="6">
                    <b-form-group label="Time">
                        <b-form-select v-model="reportForm.earliest_time" :options="timeOptions"/>
                        <error :error="reportError.earliest_time"/>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group
                        label="Label"
                    >
                        <x-tag-input :position-relative="true" :value="reportForm.label"
                                     :resource="`/api/search/labels`"
                                     column="name" name="name" @input="onLabelUpdate"/>
                        <error :error="reportError.label_id"/>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BCardText,
        BRow,
        BCol,
        BFormInput,
        BFormGroup,
        BButton,
        BSidebar,
        BImg,
        BFormCheckbox,
        BFormSelect,
        BInputGroup,
        BModal,
        VBModal
    } from 'bootstrap-vue'
    import {get, post} from "@/libs/api";
    import {form} from "@/libs/mixins";
    import Ripple from "vue-ripple-directive";
    import XTagInput from "@/components/Form/TagInput";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import Error from "@/components/Form/Error";

    export default {
        name: "SearchData",
        components: {
            Error,
            XTagInput,
            BCard,
            BCardText,
            BRow,
            BCol,
            BImg,
            BFormInput, BFormGroup, BButton, BSidebar,
            BFormCheckbox, BFormSelect, BInputGroup,
            BModal
        },
        mixins: [form],
        directives: {
            Ripple, VBModal
        },
        data() {
            return {
                eventData: null,
                totalEvents: 0,
                job_id: '',
                show: false,
                offset: 0,
                currentPage: 1,
                selectedImage: null,
                selectedApiType: null,
                selectedUseCase: null,
                categories: [],
                selectedLabel: "",
                searchObj: {
                    input: '',
                    earliest_time: '-15m',
                    label: null,
                    label_id: null
                },
                timeOptions: [
                    {
                        text: "15 minutes",
                        value: "-15m"
                    },
                    {
                        text: "60 minutes",
                        value: "-60m"
                    },
                    {
                        text: "2 hours",
                        value: "-2h"
                    },
                ],
                selectedFields: [
                    '_time',
                    'host',
                    'source',
                    'sourcetype',
                    '_raw'
                ],
                alwaysFields: [
                    '_time',
                    'host',
                    'source',
                    'sourcetype',
                    '_raw'
                ],
                reportModal: false,
                reportForm: {
                    name: null,
                    desc: null,
                    search_query: null,
                    earliest_time: null,
                    label_id: null,
                    label: null,
                    columns: []
                },
                reportError: {},

                useCaseAdditionalParams:{
                    api_type_id: null,
                    categories: []
                }

            }
        },
        created() {

        },
        methods: {
            searchResult() {
                if (this.searchObj.input == '' || this.searchObj.label_id == null) {
                    // console.log('No search');
                    return 0;
                }
                this.show = false
                this.openLoading();
                let requestParams = {
                    label_id: this.searchObj.label_id,
                    search: `search ${this.searchObj.input}`,
                    earliest: this.searchObj.earliest_time
                };

                this.selectedFields = [
                    '_time',
                    'host',
                    'source',
                    'sourcetype',
                    '_raw'
                ],

                post('/api/get_test_api', requestParams).then((res) => {
                    Vue.set(this.$data, 'eventData', res.data.events);
                    Vue.set(this.$data, 'totalEvents', res.data.total_events);
                    Vue.set(this.$data, 'job_id', res.data.job_id);
                    Vue.set(this.$data, 'selectedLabel', res.data.label_name);

                    this.offset = 0;
                    this.currentPage = 1;
                    this.show = true
                    this.closeLoading();
                }).catch((e) => {
                    this.closeLoading();
                });
            },
            selectedImage() {
                console.log("Selected");
            },
            nextPage() {
                let queryObj = {
                    offset: this.offset + 50,
                    count: 50,
                    job_id: this.job_id,
                    label_id: this.searchObj.label_id
                };

                post('/api/get_test_api_pagination', queryObj).then((res) => {
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
                    label_id: this.searchObj.label_id
                };

                post('/api/get_test_api_pagination', queryObj).then((res) => {
                    Vue.set(this.$data, 'eventData', res.data.events);
                    this.offset = this.offset - 50;
                    this.currentPage -= 1;
                });
            },
            onUseCaseUpdate(e){
                Vue.set(this.$data, 'selectedUseCase', e);
                for(var i=0;i< this.selectedUseCase.queries.length;i++){
                    if(this.selectedUseCase.queries[i].api_type_id == this.selectedApiType.id){
                        Vue.set(this.$data.searchObj, 'input', this.selectedUseCase.queries[i].query);
                        // this.searchObj.input = this.selectedUseCase[i].query;
                    }
                }
            },
            onLabelUpd(e) {
                Vue.set(this.$data.searchObj, 'label', e);
                Vue.set(this.$data.searchObj, 'label_id', e.id);
                Vue.set(this.$data.reportForm, 'label', e);
                Vue.set(this.$data.reportForm, 'label_id', e.id);
                this.selectedApiType = e.api_type;
                this.useCaseAdditionalParams.api_type_id = e.api_type.id
            },
            addReport() {
                this.reportForm.search_query = this.searchObj.input;
                this.reportForm.earliest_time = this.searchObj.earliest_time
                this.reportForm.columns = this.selectedFields
                Vue.set(this.$data, 'reportModal', true)

            },

            submitReport(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/reports', this.reportForm).then(res => {
                    if (res.data.saved) {
                        this.resetReportModal()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Report Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'reportModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.reportError = error.response.data.errors
                    }
                })

            },
            resetReportModal() {
                this.reportForm = {
                    name: null,
                    desc: null,
                    search_query: null,
                    earliest_time: null,
                    label_id: null,
                    label: null,
                    columns: []
                }
            },
            onCategoryUpdate(e){
                Vue.set(this.$data.useCaseAdditionalParams,'categories', []);
                Vue.set(this.$data,'categories', e);
                for(var i=0; i<e.length;i++){
                    this.useCaseAdditionalParams.categories.push(e[i].category_id)
                }
            },
        },
    }

</script>


<style scoped>
    .Sticky_Row {
        position: sticky;
        top: -1px;
    }

    .table td {
        padding-left: 10px !important;
        padding-right: 10px !important;
    }

    .custom_heights_table {
        height: 59vh !important;
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
