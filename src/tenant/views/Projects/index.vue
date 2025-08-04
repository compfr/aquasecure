<template>
    <div>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Projects</h3>
                </b-col>
                <b-col cols="6">
                    <b-button v-if="create_projects"

                              type="submit"
                              variant="primary"
                              class="mr-1 mb-1 float-right"
                              :to="{name:'create-projects'}"
                    >
                        Create
                    </b-button>
                </b-col>
            </b-row>
            <panel ref="panel" :url-api="urlApi" :columns="columns" :resource="resource"
                   :additional-params="additionalParams">

                <div slot="framework" slot-scope="props" class="text-nowrap">
                    <template v-if="props.item.frameworks.length > 0">
                        <b-badge variant="primary" class="mr-1"
                                 v-for="(item,index) in props.item.frameworks" :key="index">
                            {{ item.framework.name }}
                        </b-badge>
                    </template>
                    <template v-else>
                        No Framework
                    </template>
                </div>

                <div slot="policy" slot-scope="props" class="text-nowrap">
                    <template v-if="props.item.policies.length > 0">
                        <b-badge variant="primary" class="mr-1"
                                 v-for="(item,index) in props.item.policies" :key="index">
                            {{ item.policy.name }}
                        </b-badge>
                    </template>
                    <template v-else>
                        No Policy
                    </template>
                </div>

                <div slot="action" slot-scope="props" class="text-nowrap">
                    <feather-icon v-if="show_projects_btn"
                        :id="`user-row-${props.item.id}-eye-icon`"
                        icon="EyeIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="showProject(props.item.id)"
                    />
                    <!--                    <b-tooltip-->
                    <!--                        :target="`user-row-${props.item.id}-eye-icon`"-->
                    <!--                        title="Show Project"-->
                    <!--                        class="cursor-pointer"-->
                    <!--                    />-->
                    <feather-icon v-if="edit_projects"
                        :id="`user-row-${props.item.id}-edit-icon`"
                        icon="EditIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="edit(props.item.id)"
                    />
                    <!--                    <b-tooltip-->
                    <!--                        :target="`user-row-${props.item.id}-edit-icon`"-->
                    <!--                        title="Edit Project"-->
                    <!--                        class="cursor-pointer"-->
                    <!--                    />-->

                </div>
            </panel>
        </b-card>
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
        BModal,
        VBModal,
        BFormGroup,
        BFormInput, BBadge
    } from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import {get, post} from '@/libs/api.js'
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import {form} from "@/libs/mixins";
    import XTagInput from "@/components/Form/TagInput";
    import {isAllowed} from "@/libs/helpers";

    export default {
        components: {
            XTagInput,
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
            BBadge
        },
        directives: {
            'b-modal': VBModal,
            Ripple
        },
        name: "Index",
        mixins: [form],
        computed: {
            create_projects() {
                return isAllowed('create-projects')
            },
            show_projects_btn() {
                return isAllowed('show-projects')
            },
            edit_projects() {
                return isAllowed('edit-projects')
            }
        },
        data() {
            return {
                model: null,
                urlApi: "/api/projects",
                resource: "/projects",
                multiSelect: {
                    frameworks: []
                },
                additionalParams: {
                    q: '',
                    frameworks: []
                },
                columns: [
                    {
                        label: 'ID',
                        field: 'id',
                    },
                    {
                        label: 'Name',
                        field: 'name',
                    },
                    {
                        label: 'Frameworks',
                        field: 'framework',
                        custom: true
                    },
                    {
                        label: 'Policies',
                        field: 'policy',
                        custom: true
                    },
                    {
                        label: 'Start Date',
                        field: 'start_date',
                        format: 'formatDate'
                    },
                    {
                        label: 'Due Date',
                        field: 'due_date',
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
            showProject(id) {
                this.$router.push(`${this.resource}/${id}`)
            },
            deleteProject(id) {
                console.log(id)
            }
        },
    }
</script>

<style scoped>

</style>
