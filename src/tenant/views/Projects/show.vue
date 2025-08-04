<template>
    <div v-if="show">
        <b-card>
            <b-row>
                <b-col>
                    <h3>Project Detail</h3>
                </b-col>
                <b-col cols="6">
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1 mb-1 float-right"
                        @click="goBack"
                    >
                        Back
                    </b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="4" class="mb-2">
                    <h5>Name</h5>
                    <b-card-text>{{model.name}}</b-card-text>
                </b-col>
                <b-col md="4" class="mb-2">
                    <h5>Department</h5>
                    <b-card-text>{{model.department}}</b-card-text>
                </b-col>
                <b-col md="4" class="mb-2">
                    <h5>Project Owner</h5>
                    <!--                    <b-badge variant="primary">{{model.project_owner.name}}</b-badge>-->
                    <template v-if="model.project_owners.length > 0">
                        <b-badge variant="primary" class="mr-1"
                                 v-for="(item,index) in model.project_owners" :key="index">
                            {{ item.user.name }}
                        </b-badge>
                    </template>
                </b-col>
                <b-col md="12" class="mb-2">
                    <h5>Description</h5>
                    <b-card-text>{{model.description}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">

                    <h5>Frameworks</h5>
                    <template v-if="model.frameworks.length > 0">
                        <b-badge variant="primary" class="mr-1"
                                 v-for="(item,index) in model.frameworks" :key="index">
                            {{ item.framework.name }}
                        </b-badge>
                    </template>
                    <template v-else>
                        <b-badge variant="primary" class="mr-1">
                            No Frameworks
                        </b-badge>
                    </template>

                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Policies</h5>
                    <template v-if="model.policies.length > 0">
                        <b-badge variant="primary" class="mr-1"
                                 v-for="(item,index) in model.policies" :key="index">
                            {{ item.policy.name }}
                        </b-badge>
                    </template>
                    <template v-else>
                        <b-badge variant="primary" class="mr-1">
                            No Policies
                        </b-badge>
                    </template>
                </b-col>
                <b-col md="4" class="mb-2">
                    <h5>Start Date</h5>
                    <b-card-text>{{model.start_date | formatDate}}</b-card-text>
                </b-col>
                <b-col md="4" class="mb-2">
                    <h5>Due Date</h5>
                    <b-card-text>{{model.due_date | formatDate}}</b-card-text>
                </b-col>
                <b-col cols="12">
                    <hr/>
                </b-col>
            </b-row>

            <b-row v-if="showTabs">
                <b-col cols="12">
                    <b-tabs v-model="selectedTab">
                        <b-tab title="Operations">
                            <panel ref="panel" :no-pagination="true" :url-api="urlApi" :columns="columns">

                                <div slot="action" slot-scope="props" class="text-nowrap">
                                    <feather-icon :id="`user-row-${props.item.id}-edit-icon`" icon="EditIcon"
                                                  class="cursor-pointer"
                                                  size="16" @click="openSideBar(props.item.id)"/>
                                    <b-tooltip :target="`user-row-${props.item.id}-edit-icon`" title="Update Operation"
                                               class="cursor-pointer"/>
                                    <feather-icon :id="`user-row-${props.item.id}-file-icon`" icon="FileTextIcon"
                                                  class="cursor-pointer"
                                                  size="16" @click="viewOperationLogs(props.item)"/>

                                    <b-tooltip :target="`user-row-${props.item.id}-file-icon`" title="Activity Log"
                                               class="cursor-pointer"/>
                                </div>
                                <div slot="progress" slot-scope="props" class="text-nowrap">
                                    <b-progress
                                        :value="props.item.progress"
                                        max="100"
                                        height="6px"
                                        variant="primary"
                                        class="mt-25"
                                    />
                                </div>
                            </panel>
                        </b-tab>
                        <b-tab title="Notes">
                            <b-row class="align-items-end">
                                <b-col md="11">
                                    <b-form-group
                                        label="Add Note"
                                    >
                                        <b-form-textarea
                                            v-model="formNote.note"
                                            rows="4"
                                        />
                                    </b-form-group>
                                </b-col>
                                <b-col md="1">
                                    <b-button

                                        type="submit"
                                        variant="primary"
                                        class="mr-1 mb-1 float-right"
                                        @click="addNote"
                                    >
                                        Add
                                    </b-button>
                                </b-col>
                            </b-row>
                            <hr />
                            <b-row>
                                <b-col cols="12">
                                    <app-timeline>
                                        <app-timeline-note v-for="(item, index) in model.notes" :key="`notes-${item.id}`" fill-border
                                                           :title="`${item.user.name} on ${item.created_at}`" :subtitle="item.note"
                                                           icon="AwardIcon" variant="success"/>
                                    </app-timeline>
                                </b-col>
                            </b-row>
                        </b-tab>
                        <template v-for="(item, index) in tag_types">
                            <b-tab :title="item.title" :key="`tag-tab-${item.id}`">
                                <ProjectTag :tag_type="item.id" :project="model.id" v-if="selectedTab == (index+2)" />
                            </b-tab>
                        </template>
                        <b-tab title="Questionnaire">
                            <project-questionnaire :project="model.id" v-if="selectedTab == (tag_types.length+2)" />
                        </b-tab>

                    </b-tabs>
                </b-col>
            </b-row>
        </b-card>


        <!-- logs modal -->

        <b-modal v-model="logsModal" id="modal-prevent-closing" title="Activity Logs" ok-only ok-title="Close" size="lg"
                 @ok="resetOperationLogs">
            <app-timeline>
                <app-timeline-item v-for="(item, index) in selectedOperationLogs" :key="`logs-${item.id}`" fill-border
                                   :title="item.subject" :subtitle="item.message" icon="AwardIcon"
                                   :time="item.created_at"
                                   :username="item.user.name" variant="success"/>
            </app-timeline>
        </b-modal>


        <!-- sidebar -->

        <b-sidebar id="sidebar-backdrop" backdrop-variant="dark" @hidden="resetOperationForm" backdrop
                   :title="`Edit Operation`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <EditOperation form-edit-from="ProjectDetail" v-if="showSideBar" :form-id="selectedOperation"
                                       @cancel="closeShowSideBar"
                                       @close="closeReloadShowSideBar"/>
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
        BCardText,
        BRow, BTabs, BTab,
        BCol,
        BButton, BProgress,
        BBadge, BTooltip, BFormGroup, BFormTextarea
    } from 'bootstrap-vue'
    import {get, post} from '@/libs/api'
    import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
    import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
    import TaskCard from "@core/components/statistics-cards/TaskCard";
    import EditOperation from "@/tenant/views/MyAssignment/UpdateOperationForm"
    import Panel from "@/components/Table/Panel";
    import AppTimelineNote from "@core/components/app-timeline/AppTimelineNote";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import ProjectTag from "@/tenant/views/Projects/ProjectTag";
    import ProjectQuestionnaire from "@/tenant/views/Projects/ProjectQuestionnaire";

    export default {
        name: "show",
        components: {
            ProjectQuestionnaire,
            ProjectTag,
            AppTimelineNote,
            Panel,
            BTabs, BTab,
            TaskCard,
            BCard,
            BTooltip,
            AppTimeline,
            AppTimelineItem,
            BCardText,
            BRow,
            BCol,
            BButton, BProgress, BFormGroup, BFormTextarea,
            BBadge, EditOperation
        },
        data() {
            return {
                show: false,
                model: null,
                selectedTab: 0,
                urlApi: "/api/assignments",
                resource: "/assignments",
                logsModal: false,
                selectedOperation: null,
                selectedOperationLogs: [],
                formNote:{
                    project_id: this.$route.params.id,
                    note:null
                },
                showSideBar: false,
                columns: [
                    {
                        label: 'ID',
                        field: 'id',
                    },
                    {
                        label: 'Reference Code',
                        displayText: 'sub_control',
                        field: 'reference_code'
                    },
                    {
                        label: 'Description',
                        field: 'description'
                    },
                    {
                        label: 'Status',
                        displayText: 'operation_status',
                        field: 'title'
                    },
                    {
                        label: 'Progress',
                        field: 'progress',
                        custom: true
                    },
                    {
                        label: 'Action',
                        field: 'action',
                        action: true
                    }
                ],
                tag_types: [],
                showTabs: false,
            }
        },
        created() {
            get(`/api/projects/${this.$route.params.id}`).then((res) => {
                Vue.set(this.$data, 'model', res.data.model);
                this.urlApi = `/api/project_assignments?project_id=${this.$route.params.id}`
                this.show = true
            });
            get('/api/project_tag_types').then((res) => {
                Vue.set(this.$data, 'tag_types', res.data.data);
                this.showTabs = true
            });
        },
        methods: {
            openSideBar(id) {
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
            closeReloadShowSideBar() {
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showSideBar = false;
                this.$refs.panel.reload()
            },
            viewOperationLogs(item) {
                Vue.set(this.$data, 'selectedOperationLogs', item.logs)
                Vue.set(this.$data, 'logsModal', true)
            },
            resetOperationLogs() {
                this.selectedOperationLogs = [];
            },
            goBack() {
                this.$router.go(-1);
            },
            addNote(){
                if(this.formNote.note == "" || this.formNote.note == null){
                    return 0;
                }
                post('/api/project-notes', this.formNote).then((res)=>{
                    if(res.data.saved){
                        this.formNote.note = null;
                        this.model.notes.unshift(res.data.note);
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Notes Added Successfully',
                                variant: 'success'
                            },
                        });
                    }

                })
            }
        }
    }
</script>

<style scoped>

</style>
