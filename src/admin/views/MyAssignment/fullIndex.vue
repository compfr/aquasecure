<template>
    <div>
        <b-card>
            <b-row>
                <b-col>
                    <h3>All Assignment</h3>
                </b-col>
            </b-row>
            <panel ref="panel" :url-api="urlApi" :columns="columns" :resource="resource"
                   :additional-params="additionalParams">

                <div slot="action" slot-scope="props" class="text-nowrap">
                    <feather-icon :id="`user-row-${props.item.id}-edit-icon`" icon="EditIcon" class="cursor-pointer"
                                  size="16" @click="openSideBar(props.item.id)" />
                    <b-tooltip :target="`user-row-${props.item.id}-edit-icon`" title="Update Operation"
                               class="cursor-pointer" />

                    <!-- <feather-icon :id="`user-row-${props.item.id}-urgency-icon`" icon="AlertCircleIcon"
                        class="cursor-pointer" size="16" @click="updateOperationUrgency(props.item)" />

                    <b-tooltip :target="`user-row-${props.item.id}-urgency-icon`" title="Update Urgency"
                        class="cursor-pointer" /> -->


                    <feather-icon :id="`user-row-${props.item.id}-file-icon`" icon="FileTextIcon" class="cursor-pointer"
                                  size="16" @click="viewOperationLogs(props.item)" />

                    <b-tooltip :target="`user-row-${props.item.id}-file-icon`" title="Activity Log"
                               class="cursor-pointer" />
                </div>
            </panel>
        </b-card>

        <!-- modal -->

        <!-- <b-modal v-model="operationStatusModal" id="modal-project-owner" title="Update Status" ok-title="Submit"
            cancel-variant="outline-secondary" @hidden="resetOperationStatusModal" @ok="submitOperationStatus">

            <b-form-group label="Status">
                <x-tag-input :value="operationStatusForm.status" :resource="`/api/search/operation_status`"
                    column="title" name="title" @input="onOperationStatus" />
                <error :error="operationStatusError.status_id" />
            </b-form-group>

            <b-form-group label="Comments">
                <b-form-textarea v-model="operationStatusForm.message" />
                <error :error="operationStatusError.message" />
            </b-form-group>

        </b-modal> -->


        <!-- urgency -->

        <!-- <b-modal v-model="operationUrgencyModal" id="modal-urgency-owner" title="Update Urgency" ok-title="Submit"
            cancel-variant="outline-secondary" @hidden="resetOperationUrgencyModal" @ok="submitOperationUrgency">

            <b-form-group label="Urgency">
                <x-tag-input :value="operationUrgencyForm.urgency" :resource="`/api/search/operation_urgency`"
                    column="title" name="title" @input="onOperationUrgency" />
                <error :error="operationUrgencyError.urgency_id" />
            </b-form-group>

            <b-form-group label="Comments">
                <b-form-textarea v-model="operationUrgencyForm.message" />
                <error :error="operationUrgencyError.message" />
            </b-form-group>

        </b-modal> -->


        <!-- logs modal -->

        <b-modal v-model="logsModal" id="modal-prevent-closing" title="Activity Logs" ok-only ok-title="Close" size="lg"
                 @ok="resetOperationLogs">
            <app-timeline>
                <app-timeline-item v-for="(item, index) in selectedOperationLogs" :key="`logs-${item.id}`" fill-border
                                   :title="item.subject" :subtitle="item.message" icon="AwardIcon" :time="item.created_at"
                                   :username="item.user.name" variant="success" />
            </app-timeline>
        </b-modal>



        <!-- sidebar -->

        <b-sidebar id="sidebar-backdrop" backdrop-variant="dark" @hidden="resetOperationForm" backdrop
                   :title="`Edit Operation`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <EditOperation v-if="showSideBar" :form-id="selectedOperation" @cancel="closeShowSideBar"
                                       @close="closeReloadShowSideBar" />
                    </div>
                </template>
            </div>
        </b-sidebar>

    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BRow,
        BCol,
        BCardText,
        BLink,
        BButton,
        BTooltip,
        BSidebar,
        BModal,
        VBModal,
        BFormGroup,
        BFormInput, BBadge, BFormTextarea
    } from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import { get, post } from '@/libs/api.js'
    import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
    import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import { form } from "@/libs/mixins";
    import XTagInput from "@/components/Form/TagInput";
    import EditOperation from "@/admin/views/MyAssignment/UpdateOperationForm"

    export default {
        components: {
            XTagInput,
            AppTimeline,
            AppTimelineItem,
            BFormGroup,
            BFormInput,
            BModal,
            BCard,
            BCardText,
            BLink,
            BButton,
            BRow,
            BCol,
            BTooltip,
            Panel,
            TagInput,
            BBadge, BFormTextarea, BSidebar, EditOperation
        },
        directives: {
            'b-modal': VBModal,
            Ripple
        },
        name: "fullIndex",
        mixins: [form],
        data() {
            return {
                model: null,
                urlApi: "/api/assignments",
                resource: "/assignments",
                selectedOperation: null,
                additionalParams: {
                    q: '',
                },
                logsModal: false,
                selectedOperationLogs: [],
                showSideBar: false,
                columns: [
                    {
                        label: 'ID',
                        field: 'id',
                    },
                    {
                        label: 'Task Type',
                        displayText: 'task_type',
                        field: 'title'
                    },
                    {
                        label: 'Description',
                        field: 'description'
                    },
                    {
                        label: 'Source',
                        field: 'source',
                    },
                    {
                        label: 'Status',
                        displayText: 'operation_status',
                        field: 'title'
                    },
                    {
                        label: 'Urgency',
                        displayText: 'operation_urgency',
                        field: 'title'
                    },
                    {
                        label: 'Owner',
                        displayText: 'owner',
                        field: 'name',
                    },
                    {
                        label: 'Comments',
                        field: 'comments',
                    },
                    {
                        label: 'Due Time',
                        field: 'due_time',
                        format: 'formatDate'
                    },
                    {
                        label: 'Created Time',
                        field: 'created_at',
                        format: 'formatDate'
                    },
                    {
                        label: 'Action',
                        field: 'action',
                        action: true
                    }
                ],
            }
        },
        methods: {
            edit(id) {
                this.$router.push(`${this.resource}/${id}/edit`)
            },
            deleteProject(id) {
                console.log(id)
            },

            openSideBar(id) {
                console.log(id)
                this.selectedOperation = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showSideBar = true;
            },
            resetOperationForm() {
                this.showSideBar = false;
            },
            closeShowSideBar() {
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showSideBar = false;
            },
            closeReloadShowSideBar(){
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showSideBar = false;
                this.$refs.panel.reload()
            },

            // updateOperationStatus(item) {
            //     Vue.set(this.$data.operationStatusForm, 'status', item.operation_status)
            //     Vue.set(this.$data.operationStatusForm, 'status_id', item.operation_status.id)
            //     Vue.set(this.$data.operationStatusForm, 'operation_id', item.id)
            //     Vue.set(this.$data, 'operationStatusModal', true)
            // },

            // onOperationStatus(e) {
            //     Vue.set(this.$data.operationStatusForm, 'status', e)
            //     Vue.set(this.$data.operationStatusForm, 'status_id', e.id)
            // },
            // submitOperationStatus(bvModalEvt) {
            //     bvModalEvt.preventDefault()
            //     post('/api/operation-update-status', this.operationStatusForm).then(res => {
            //         if (res.data.saved) {
            //             this.resetOperationStatusModal()
            //             this.$toast({
            //                 component: ToastificationContent,
            //                 props: {
            //                     title: 'Success',
            //                     icon: 'BellIcon',
            //                     text: 'Operation Status Updated',
            //                     variant: 'success'
            //                 },
            //             })
            //             Vue.set(this.$data, 'operationStatusModal', false)
            //             this.$refs.panel.reload()
            //         }
            //     }).catch(error => {
            //         if (error.response.status === 422) {
            //             this.operationStatusError = error.response.data.errors
            //         }
            //     })
            // },
            // resetOperationStatusModal() {
            //     this.operationStatusForm = {
            //         message: null,
            //         status: null,
            //     }
            // },


            viewOperationLogs(item) {
                Vue.set(this.$data, 'selectedOperationLogs', item.logs)
                Vue.set(this.$data, 'logsModal', true)
            },


            resetOperationLogs(){
                this.selectedOperationLogs = [];
            },

            // // urgency

            // updateOperationUrgency(item) {
            //     Vue.set(this.$data.operationUrgencyForm, 'urgency', item.operation_urgency)
            //     Vue.set(this.$data.operationUrgencyForm, 'urgency_id', item.operation_urgency.id)
            //     Vue.set(this.$data.operationUrgencyForm, 'operation_id', item.id)
            //     Vue.set(this.$data, 'operationUrgencyModal', true)
            // },

            // onOperationUrgency(e) {
            //     Vue.set(this.$data.operationUrgencyForm, 'urgency', e)
            //     Vue.set(this.$data.operationUrgencyForm, 'urgency_id', e.id)
            // },
            // submitOperationUrgency(bvModalEvt) {
            //     bvModalEvt.preventDefault()
            //     post('/api/operation-update-urgency', this.operationUrgencyForm).then(res => {
            //         if (res.data.saved) {
            //             this.resetOperationUrgencyModal()
            //             this.$toast({
            //                 component: ToastificationContent,
            //                 props: {
            //                     title: 'Success',
            //                     icon: 'BellIcon',
            //                     text: 'Operation Urgency Updated',
            //                     variant: 'success'
            //                 },
            //             })
            //             Vue.set(this.$data, 'operationUrgencyModal', false)
            //             this.$refs.panel.reload()
            //         }
            //     }).catch(error => {
            //         if (error.response.status === 422) {
            //             this.operationUrgencyError = error.response.data.errors
            //         }
            //     })
            // },
            // resetOperationUrgencyModal() {
            //     this.operationUrgencyForm = {
            //         message: null,
            //         urgency: null,
            //     }
            // },
        },
    }
</script>

<style scoped></style>
