<template>
    <div>
        <b-row>
            <b-col cols="12">
                <b-button @click="addWidget" class="float-right mb-1" variant="primary">
                    <feather-icon icon="PlusIcon" size="14"/>
                    Add
                </b-button>
            </b-col>
        </b-row>
        <b-row v-if="widgets.length > 0">
            <b-col cols="6" v-for="(item,index) in widgets" :key="`widget-${index}`">
                <WidgetLineChart v-if="item.chart_type_id == 1" :title="`${item.name} (${item.report.title})`" :column_x="item.column_x" :column_y="item.column_y" :report="item.report" />
                <WidgetBarChart v-if="item.chart_type_id == 2" :title="`${item.name} (${item.report.title})`" :column_x="item.column_x" :column_y="item.column_y" :report="item.report" />
                <WidgetBarChartHorizontal v-if="item.chart_type_id == 3" :title="`${item.name} (${item.report.title})`" :column_x="item.column_x" :column_y="item.column_y" :report="item.report" />
            </b-col>
        </b-row>

        <b-modal
            v-model="showFormModal"
            id="modal-prevent-closing"
            title="Add Widget"
            ok-title="Save"
            size="lg"
            no-close-on-backdrop
            no-close-on-esc
            cancel-variant="outline-secondary"
            @hidden="resetUseCaseModal"
            @ok="handleUseCaseOk">
            <b-row>
                <b-col cols="6">
                    <b-form-group label="Name">
                        <b-form-input placeholder="Name" v-model="widgetForm.name"/>
                        <error :error="widgetError.name"/>
                    </b-form-group>
                </b-col>
                <b-col cols="6">
                    <b-form-group label="Visualisation">
                        <x-tag-input :position-relative="true" :value="widgetForm.chart_type"
                                     :resource="`/api/search/chart_types`"
                                     column="title" name="title" @input="onChartTypeUpdate"/>
                        <error :error="widgetError.chart_type_id"/>
                    </b-form-group>
                </b-col>
                <b-col cols="12">
                    <b-form-group label="Report">
                        <x-tag-input :position-relative="true" :value="widgetForm.report"
                                     :resource="`/api/search/reports`"
                                     column="title" name="title" @input="onReportUpdate"/>
                        <error :error="widgetError.report_id"/>
                    </b-form-group>
                </b-col>
                <b-col cols="6" v-if="widgetForm.report">
                    <b-form-group label="X-axis Column">
                        <b-form-select v-model="widgetForm.column_x" :options="widgetForm.report.columns"
                                       @input="onSelectXUpdate"/>
                        <error :error="widgetError.column_x"/>
                    </b-form-group>
                </b-col>
                <b-col cols="6" v-if="widgetForm.report">
                    <b-form-group label="Y-axis Column">
                        <b-form-select v-model="widgetForm.column_y" :options="widgetForm.report.columns"
                                       @input="onSelectYUpdate"/>
                        <error :error="widgetError.column_y"/>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>

<script>

    import Vue from 'vue'
    import {BRow, BCol, BButton, BModal, BFormGroup, BFormInput, BFormSelect} from 'bootstrap-vue'
    import {get, post} from "@/libs/api";
    import {objectToFormData} from "@/libs/helpers";
    import XTagInput from "@/components/Form/TagInput";
    import Error from "@/components/Form/Error";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import {form} from "@/libs/mixins";
    import WidgetLineChart from "@/admin/views/Components/WidgetLineChart";
    import WidgetBarChart from "@/admin/views/Components/WidgetBarChart";
    import WidgetBarChartHorizontal from "@/admin/views/Components/WidgetBarChartHorizontal";

    export default {
        name: "index",
        mixins: [form],
        components: {
            WidgetBarChartHorizontal,
            WidgetBarChart,
            WidgetLineChart,
            Error,
            XTagInput,
            BRow, BCol, BButton, BModal, BFormGroup, BFormInput, BFormSelect
        },
        data() {
            return {
                showFormModal: false,
                widgetForm: {
                    name: null,
                    report: null,
                    report_id: null,
                    chart_type: null,
                    chart_type_id: null,
                    column_x: null,
                    column_y: null
                },
                widgetError: {},
                widgets:[],
            }
        },
        created(){
            get('/api/widgets').then((res)=>{
                this.widgets = res.data.data
            })
        },
        methods: {
            addWidget() {
                Vue.set(this.$data, 'showFormModal', true)
            },
            handleUseCaseOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                this.submitWidget()
            },
            resetUseCaseModal() {
                this.widgetForm = {
                    name: null,
                    report: null,
                    report_id: null,
                    chart_type: null,
                    chart_type_id: null,
                    column_x: null,
                    column_y: null
                }
            },
            submitWidget() {
                this.widgetError = {};
                this.openLoading()
                post('/api/widgets', this.widgetForm).then((res) => {
                    if (res.data.saved) {
                        this.resetUseCaseModal()
                        this.closeLoading()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Widget Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'showFormModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.widgetError = error.response.data.errors
                    }
                    this.closeLoading()
                })
            },
            onReportUpdate(e) {
                Vue.set(this.$data.widgetForm, 'report', e);
                Vue.set(this.$data.widgetForm, 'report_id', e.id);
            },
            onChartTypeUpdate(e) {
                Vue.set(this.$data.widgetForm, 'chart_type', e);
                Vue.set(this.$data.widgetForm, 'chart_type_id', e.id);
            },
            onSelectXUpdate(e) {
                if (e == this.widgetForm.column_y) {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: 'Error',
                            icon: 'BellIcon',
                            text: 'Column X and Y Matches',
                            variant: 'danger'
                        },
                    })
                    Vue.set(this.$data.widgetForm, 'column_x', null);
                    return 0;
                }
                Vue.set(this.$data.widgetForm, 'column_x', e);
            },
            onSelectYUpdate(e) {
                if (e == this.widgetForm.column_x) {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: 'Error',
                            icon: 'BellIcon',
                            text: 'Column X and Y Matches',
                            variant: 'danger'
                        },
                    })
                    Vue.set(this.$data.widgetForm, 'column_y', null);
                    return 0;
                }
                Vue.set(this.$data.widgetForm, 'column_y', e);
            },


        }
    }
</script>

<style scoped>

</style>
