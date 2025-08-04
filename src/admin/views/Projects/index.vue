<template>
    <div>
        <template v-if="view_projects">
            <b-row>
                <b-col xl="3"
                       md="6" v-for="(item,index) in data" :key="index">
                    <b-card body-class="d-flex flex-column justify-content-between" class="text-center project-cards">
                        <div>
                            <b-avatar
                                class="mb-1"
                                :variant="`light-danger`"
                                size="45"
                            >
                                <feather-icon
                                    size="21"
                                    icon="XIcon"
                                />
                            </b-avatar>
                            <div class="truncate d-flex flex-column">
                                <p class="mb-2">Pending</p>
                                <h5 class="font-weight-bolder text-capitalize mb-2">
                                    {{ item.name }}
                                </h5>
                                <h6 class="font-weight-bolder text-capitalize mb-2">
                                    {{ item.tenant.name }}
                                </h6>
                                <span class="text-capitalize mb-1">{{ item.description }}</span>
                            </div>
                        </div>
                        <div>
                            <template v-if="item.is_framework == 1">
                                <span class="text-capitalize"><strong>Frameworks</strong></span>
                                <p>{{item.frameworks.map(value => value.framework.title).join(", ")}}</p>
                            </template>
                            <template v-else>
                                <span class="text-capitalize"><strong>Policies</strong></span>
                                <p>{{item.policies.map(value => value.policy.title).join(", ")}}</p>
                            </template>
                            <div class="d-flex flex-row align-items-center justify-content-center mt-1">
                                <div :id="`project-tasks-${index}`">
                                    <feather-icon
                                        size="15"
                                        class="text-primary"
                                        icon="FileIcon"
                                    />
                                    <span>{{item.tasks_count}}</span>
                                </div>
                                <b-tooltip
                                    :target="`project-tasks-${index}`"
                                    title="Total Tasks"
                                    class="cursor-pointer"
                                />

                                <div class="mx-2" :id="`project-tasks-pending-${index}`">
                                    <feather-icon
                                        size="15"
                                        class="text-danger"
                                        icon="XIcon"
                                    />
                                    <span>{{item.pending_tasks_count}}</span>
                                </div>
                                <b-tooltip
                                    :target="`project-tasks-pending-${index}`"
                                    title="Pending Tasks"
                                    class="cursor-pointer"
                                />

                                <div :id="`project-tasks-completed-${index}`">
                                    <feather-icon
                                        size="15"
                                        class="text-success"
                                        icon="CheckIcon"
                                    />
                                    <span>{{item.completed_tasks_count}}</span>
                                </div>
                                <b-tooltip
                                    :target="`project-tasks-completed-${index}`"
                                    title="Completed Tasks"
                                    class="cursor-pointer"
                                />
                            </div>
                        </div>
                    </b-card>
                </b-col>
            </b-row>
        </template>
        <template v-else>
            This is Not Working No Permission
        </template>
    </div>
</template>

<script>
    import {BRow, BCol, BCard, BAvatar, BTooltip} from 'bootstrap-vue'
    import {get} from "@/libs/api";
    import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
    import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
    import TaskCard from "@core/components/statistics-cards/TaskCard";
    import {isAllowed} from "@/libs/helpers";

    export default {
        components: {
            BAvatar,
            TaskCard,
            BCard,
            BRow,
            BCol,
            AppTimeline,
            AppTimelineItem,
            BTooltip
        },
        data() {
            return {
                data: []
            }
        },
        computed: {
            view_projects() {
                return isAllowed('view-projects');
            }
        },
        created() {
            get(`/api/projects`).then((res) => {
                this.data = res.data.data;
            });
        },
        methods: {
            showProject(id) {
                this.$router.push(`/projects/${id}`)
            },
        }
    }
</script>
<style scoped>
    .project-cards {
        height: 420px !important;
    }

    .progress-icon {
        left: 50%;
        transform: translateX(-50%);
        padding-bottom: 1rem;
    }
</style>
