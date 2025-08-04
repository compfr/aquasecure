<template>
    <div>
        <b-card>
            <b-row>
                <b-col>
                    <h3>My Assignment</h3>
                </b-col>
            </b-row>
            <b-row class="align-items-center">
                <b-col md="4">
                    <b-form-group
                        label="Task Type"
                    >
                        <x-tag-input :removable="true" keyIndex="task_type_id"
                                     :multiple="true" :value="task_types" relation="task_type"
                                     :resource="`/api/search/task_types`" column="title" name="title"
                                     @input="onFilterTagUpdate($event,'task_types', 'task_type')">
                        </x-tag-input>
                    </b-form-group>
                </b-col>
                <b-col md="4">
                    <b-form-group
                        label="Status"
                    >
                        <x-tag-input :removable="true" keyIndex="status_id"
                                     :multiple="true" :value="operation_statuses" relation="status"
                                     :resource="`/api/search/operation_status`" column="title" name="title"
                                     @input="onFilterTagUpdate($event,'operation_statuses', 'status')">
                        </x-tag-input>
                    </b-form-group>
                </b-col>
                <b-col md="4">
                    <b-form-group
                        label="Urgency"
                    >
                        <x-tag-input :removable="true" keyIndex="urgency_id"
                                     :multiple="true" :value="operation_urgencies" relation="urgency"
                                     :resource="`/api/search/operation_urgency`" column="title" name="title"
                                     @input="onFilterTagUpdate($event,'operation_urgencies', 'urgency')">
                        </x-tag-input>
                    </b-form-group>
                </b-col>
                <b-col md="8">
                    <b-form-group label="Source">
                        <b-form-input v-model="additionalParams.source" />
                    </b-form-group>
                </b-col>
                <b-col md="4">
                    <b-button type="submit" variant="primary" class="mr-1"
                              @click="searchAssignments">
                        Search
                    </b-button>
                </b-col>
            </b-row>

        </b-card>
        <b-card>
            <panel ref="panel" :url-api="urlApi" :columns="columns" :resource="resource"
                   :additional-params="additionalParams">

                <div slot="task_users" slot-scope="props" class="text-wrap">
                    <template v-if="props.item.stage == 0 || props.item.stage == 4">
                        <template v-if="props.item.project_owners.length > 0">
                            <b-badge variant="primary" class="mr-1"
                                     v-for="(item,index) in props.item.project_owners" :key="index">
                                {{ item.user.name }}
                            </b-badge>
                        </template>
                        <b-badge v-else variant="primary">No Project Owners</b-badge>
                    </template>
                    <template v-if="props.item.stage == 1">
                        <template v-if="props.item.implementors.length > 0">
                            <b-badge variant="primary" class="mr-1"
                                     v-for="(item,index) in props.item.implementors" :key="index">
                                {{ item.user.name }}
                            </b-badge>
                        </template>
                        <b-badge v-else variant="primary">No Implementors</b-badge>
                    </template>
                    <template v-if="props.item.stage == 2">
                        <template v-if="props.item.internal_auditors.length > 0">
                            <b-badge variant="primary" class="mr-1"
                                     v-for="(item,index) in props.item.internal_auditors" :key="index">
                                {{ item.user.name }}
                            </b-badge>
                        </template>
                        <b-badge v-else variant="primary">No Internal Auditors</b-badge>
                    </template>
                    <template v-if="props.item.stage == 3">
                        <template v-if="props.item.external_auditors.length > 0">
                            <b-badge variant="primary" class="mr-1"
                                     v-for="(item,index) in props.item.external_auditors" :key="index">
                                {{ item.user.name }}
                            </b-badge>
                        </template>
                        <b-badge v-else variant="primary">No External Auditors</b-badge>
                    </template>
                </div>
                <div slot="action" slot-scope="props" class="text-nowrap">
                    <feather-icon :id="`user-row-${props.item.id}-edit-icon`" icon="EditIcon" class="cursor-pointer"
                                  size="16" @click="openSideBar(props.item.id)" />
                    <b-tooltip :target="`user-row-${props.item.id}-edit-icon`" title="Update Operation"
                               class="cursor-pointer" />

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
    import EditOperation from "@/tenant/views/MyAssignment/UpdateOperationForm"

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
        name: "Index",
        mixins: [form],
        data() {
            return {
                model: null,
                urlApi: "/api/my-assignment",
                resource: "/my-assignment",
                selectedOperation: null,
                additionalParams: {
                    source: '',
                    task_types: [],
                    operation_statuses: [],
                    operation_urgencies:[]
                },
                task_types: [],
                operation_statuses:[],
                operation_urgencies:[],
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
                        label: 'Task Owner',
                        field: 'task_users',
                        custom: true
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

            onFilterTagUpdate(e, object, key ) {
                Vue.set(this.$data.additionalParams, object, []);
                Vue.set(this.$data, object, e);
                for (var i = 0; i < e.length; i++) {
                    this.additionalParams[object].push(e[i][`${key}_id`])
                }
            },


            searchAssignments() {
                this.$refs.panel.reload();
            },


            viewOperationLogs(item) {
                Vue.set(this.$data, 'selectedOperationLogs', item.logs)
                Vue.set(this.$data, 'logsModal', true)
            },


            resetOperationLogs(){
                this.selectedOperationLogs = [];
            },

        },
    }
</script>

<style scoped></style>
