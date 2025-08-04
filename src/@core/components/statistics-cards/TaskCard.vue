<template>
    <div>
        <b-card class="text-center card-modal">
            <div>
                <b-avatar
                    class="mb-1"
                    :variant="`light-${color}`"
                    size="45"
                >
                    <feather-icon
                        size="21"
                        :icon="icon"
                    />
                </b-avatar>
                <div class="truncate">
                    <p class="mb-2">{{ taskStatus }}</p>
                    <h5 class="font-weight-bolder text-capitalize mb-2">
                        {{ taskName }}
                    </h5>
                    <span class="text-capitalize">{{ taskDesc }}</span>
<!--                    <vue-apex-charts-->
<!--                        type="line"-->
<!--                        height="100"-->
<!--                        width="100%"-->
<!--                        :options="chartOptionsComputed"-->
<!--                        :series="chartData"-->
<!--                    />-->
                </div>
            </div>
            <div class="position-right-0 position-top-0 position-absolute m-1">
                <b-button>
                    <b-button>
                        <feather-icon
                            size="15"
                            icon="UserIcon"
                            @click="addNewAssignee"
                        />
                    </b-button>
                    <feather-icon
                        class="mx-1"
                        size="15"
                        icon="FileTextIcon"
                        @click="openLogs"
                    />
                </b-button>
                <b-button>
                    <feather-icon
                        size="15"
                        icon="EditIcon"
                        @click="openTask"
                    />
                </b-button>
            </div>
        </b-card>

        <!--        task logs-->

        <b-modal
            v-model="logsModal"
            id="modal-prevent-closing"
            title="Task Logs"
            ok-only
            ok-title="Close">
            <app-timeline>
                <app-timeline-item v-for="(item,index) in logs" :key="`logs-${item.id}`"
                                   :title="item.message"
                                   icon="AwardIcon"
                                   :time="item.created_at"
                                   variant="success"
                />

                <!--                <app-timeline-item-->
                <!--                    title="Last milestone remain"-->
                <!--                    subtitle="You are just one step away from your goal"-->
                <!--                    icon="InfoIcon"-->
                <!--                    time="3 minutes ago"-->
                <!--                    variant="info"-->
                <!--                />-->

                <!--                <app-timeline-item-->
                <!--                    title="Your are running low on time"-->
                <!--                    subtitle="Only 30 minutes left to finish milestone"-->
                <!--                    icon="ClockIcon"-->
                <!--                    time="21 minutes ago"-->
                <!--                    variant="warning"-->
                <!--                />-->

                <!--                <app-timeline-item-->
                <!--                    title="Client Meeting"-->
                <!--                    subtitle="New event has been added to your schedule"-->
                <!--                    icon="UserIcon"-->
                <!--                    time="36 minutes ago"-->
                <!--                />-->

                <!--                <app-timeline-item-->
                <!--                    title="Product Design"-->
                <!--                    subtitle="Product design added in workflow"-->
                <!--                    icon="GridIcon"-->
                <!--                    time="1 hour ago"-->
                <!--                    variant="success"-->
                <!--                />-->
            </app-timeline>
        </b-modal>

        <!--        for edit task-->

        <b-modal
            v-model="editTaskModal"
            id="edit-task-modal"
            title="Edit Task"
            cancel-variant="outline-secondary"
            ok-title="Submit"
            @hidden="resetTaskModal"
            @ok="submitTask">
            <b-form-group label="Message">
                <b-form-textarea
                    v-model="taskForm.message"
                    id="textarea-large"
                    size="lg"
                    placeholder="write a message..."
                    class="my-2"
                ></b-form-textarea>
                <error :error="taskError.message"/>
            </b-form-group>
            <b-form-group id="input-group-3" label="Status:" label-for="input-3">
                <b-form-select
                    v-model="taskForm.status"
                    id="input-3"
                    :options="[{value:null,text:'Select'},{value: 1, text: 'Pending'},{value: 2, text: 'Completed'},{value: 3, text: 'In Process'}]"
                ></b-form-select>
                <error :error="taskError.status"/>
            </b-form-group>
        </b-modal>

        <!--        for assignee-->

        <b-modal
            v-model="assigneeModal"
            id="modal-assignee"
            title="Add New Assignee"
            ok-title="Submit"
            cancel-variant="outline-secondary"
            @hidden="resetAssigneeModal"
            @ok="submitAssignee">
            <b-col>
                <b-form-group
                    label="Assignee"
                >
                    <x-tag-input :value="form.assignee" :resource="`/api/search/users?user_not_in=${task.assignee_id}`"
                                 column="title" name="name" @input="onAssigneeUpdate"/>
                    <error :error="assigneeError.assignee"/>
                </b-form-group>
            </b-col>
        </b-modal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
    import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
    import {BCard, BAvatar, BFormTextarea, BFormGroup, BFormSelect} from 'bootstrap-vue'
    import {post} from "@/libs/api";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import XTagInput from "@/components/Form/TagInput";

    export default {
        components: {
            XTagInput,
            BFormTextarea,
            BFormGroup,
            BCard,
            BAvatar,
            AppTimeline,
            AppTimelineItem,
            BFormSelect
        },
        props: {
            icon: {
                type: String,
                required: true,
            },
            taskName: {
                type: String,
                required: true,
            },
            taskDesc: {
                type: String,
                default: '',
            },
            taskStatus: {
                type: String,
                default: '',
            },
            color: {
                type: String,
                default: 'primary',
            },
            task: [Object, Array],
            logs: [Object, Array]
        },
        data() {
            return {
                logsModal: false,
                editTaskModal: false,
                assigneeModal: false,
                assigneeError: {},
                form: {
                    task_id: this.task.id,
                    assignee: null
                },
                taskForm: {
                    task_id: this.task.id,
                    message: null,
                    status: null,
                },
                taskError: {}
            }
        },
        methods: {
            openLogs() {
                Vue.set(this.$data, 'logsModal', true)
            },
            openTask() {
                Vue.set(this.$data, 'editTaskModal', true)
            },
            submitTask(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/task-update', this.taskForm).then(res => {
                    if (res.data.saved) {
                        this.resetTaskModal()
                        this.$emit('updateTask', res.data.task);
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Task Updated',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'editTaskModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.taskError = error.response.data.errors
                    }
                })
            },
            resetTaskModal() {
                this.taskForm = {
                    task_id: this.task.id,
                    message: null,
                    status: null,
                }
            },
            addNewAssignee() {
                Vue.set(this.$data, 'assigneeModal', true)
                Vue.set(this.$data.form, 'assignee', this.task.assignee)
                Vue.set(this.$data.form, 'assignee_id', this.task.assignee_id)
            },
            submitAssignee(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/task-update-assignee', this.form).then(res => {
                    if (res.data.saved) {
                        this.resetAssigneeModal()
                        this.$emit('updateTask', res.data.task);
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Assignee Updated',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'assigneeModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.assigneeError = error.response.data.errors
                    }
                })
            },
            resetAssigneeModal() {
                this.form = {
                    task_id: this.task.id,
                    assignee: null,
                    assignee_id: this.task.assignee_id
                }
            },
            onAssigneeUpdate(e) {
                Vue.set(this.$data.form, 'assignee_id', e.id)
                Vue.set(this.$data.form, 'assignee', e)
            },
        }
    }
</script>

<style scoped>
    .card-modal {
        height: 350px !important;
    }
</style>
