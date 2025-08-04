<template>
    <div>
        <b-card title="Add Discovery">
            <b-row>
                <b-col md="6">
                    <b-form-group
                        label="Seed"
                    >
                        <b-form-input
                            placeholder="Seed"
                            v-model="form.seed"
                        />
                        <error :error="error.seed"/>
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group
                        label="Comment"
                    >
                        <b-form-input
                            placeholder="Comment"
                            v-model="form.comment"
                        />
                        <error :error="error.comment"/>
                    </b-form-group>
                </b-col>

                <b-col cols="5">
                    <div class="position-top-0 position-right-0 position-absolute px-1" @click="addDiscoveryType">
                        <small>Add New</small>
                    </div>
                    <b-form-group
                        label="Discovery Type"
                    >
                        <x-tag-input :value="form.discovery_type" :resource="`/api/search/discovery-types`"
                                     column="title"
                                     name="title"
                                     @input="onDiscoveryTypeUpdate">
                        </x-tag-input>
                        <error :error="error.discovery_type_id"/>
                    </b-form-group>
                </b-col>

                <b-col cols="5">
                    <div class="position-top-0 position-right-0 position-absolute px-1" @click="addDiscoveryProject">
                        <small>Add New</small>
                    </div>
                    <b-form-group
                        label="Project"
                    >
                        <x-tag-input :value="form.discovery_project" :resource="`/api/search/discovery-projects`"
                                     column="title"
                                     name="title"
                                     @input="onDiscoveryProjectUpdate">
                        </x-tag-input>
                        <error :error="error.discovery_project_id"/>
                    </b-form-group>
                </b-col>

                <b-col cols="2">
                    <b-button

                        type="submit"
                        variant="primary"
                        class=" mt-2 float-right"
                        @click="formSubmitted"
                    >
                        Add Discovery
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
        <b-card>
            <panel ref="panel" :url-api="urlApi" :columns="columns" :resource="resource"
                   :additional-params="additionalParams">
                <div slot="action" slot-scope="props" class="text-nowrap">
                    <feather-icon
                        :id="`user-row-${props.item.id}-eye-icon`"
                        icon="EyeIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="showDiscovery(props.item.id)"
                    />
                    <!--                    <b-tooltip-->
                    <!--                        :target="`user-row-${props.item.id}-eye-icon`"-->
                    <!--                        title="Show Control"-->
                    <!--                        class="cursor-pointer"-->
                    <!--                    />-->
                    <feather-icon
                        :id="`user-row-${props.item.id}-edit-icon`"
                        icon="EditIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="edit(props.item.id)"
                    />
                    <!--                    <b-tooltip-->
                    <!--                        :target="`user-row-${props.item.id}-edit-icon`"-->
                    <!--                        title="Edit Control"-->
                    <!--                        class="cursor-pointer"-->
                    <!--                    />-->

                </div>
            </panel>
        </b-card>

        <b-modal
            v-model="discoveryTypeModal"
            id="modal-category"
            title="Add New Discovery Type"
            ok-title="Submit"
            cancel-variant="outline-secondary"
            @hidden="resetDiscoveryTypeModal"
            @ok="submitDiscoveryType">

            <b-form-group
                label="Title"
            >
                <b-form-input
                    placeholder="Title"
                    v-model="discoveryTypeForm.title"
                />
                <error :error="discoveryTypeError.title"/>
            </b-form-group>
        </b-modal>

        <b-modal
            v-model="discoveryProjectModal"
            id="modal-tag-type"
            title="Add New Project"
            ok-title="Submit"
            cancel-variant="outline-secondary"
            @hidden="resetDiscoveryProjectModal"
            @ok="submitDiscoveryProject">

            <b-form-group
                label="Title"
            >
                <b-form-input
                    placeholder="Title"
                    v-model="discoveryProjectForm.title"
                />
                <error :error="discoveryProjectError.title"/>
            </b-form-group>
        </b-modal>
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
    BFormInput, BBadge, BFormFile
} from 'bootstrap-vue'
import Panel from "@/components/Table/Panel";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import {get, post} from '@/libs/api.js'
import Ripple from "vue-ripple-directive";
import TagInput from "@/components/Form/TagInput";
import {form} from "@/libs/mixins";
import XTagInput from "@/components/Form/TagInput";
import {objectToFormData} from "@/libs/helpers";
import DomainForm from "@/admin/views/Domains/DomainForm";
import ShowDomain from "@/admin/views/Domains/ShowDomain.vue";
import Error from "@/components/Form/Error.vue";

export default {
    components: {
        Error,
        ShowDomain,
        DomainForm,
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
        BBadge,
        BFormFile
    },
    directives: {
        'b-modal': VBModal,
        Ripple
    },
    name: "DiscoveryIndex",
    mixins: [form],
    created() {
        this.form = {
            seed: null,
            comment: null,
            discovery_project_id: null,
            discovery_project: null,
            discovery_type_id: null,
            discovery_type: null,
        }
    },
    data() {
        return {
            model: null,
            urlApi: "/api/asm-discovery",
            resource: "/asm-discovery",
            store: "/api/asm-discovery",
            method: "POST",
            title: 'Add',
            message: 'New Discovery Added',
            discoveryTypeModal: false,
            discoveryTypeForm: {
                title: null
            },
            discoveryTypeError: {},
            discoveryProjectModal: false,
            discoveryProjectForm: {
                title: null
            },
            discoveryProjectError: {},
            additionalParams: {
                q: '',
            },

            columns: [
                {
                    label: 'ID',
                    field: 'id',
                },
                {
                    label: 'Name',
                    field: 'seed',
                },
                {
                    label: 'Comment',
                    field: 'comment',
                },
                {
                    label: 'Type',
                    displayText: 'type',
                    field: 'title',
                },
                {
                    label: 'Project',
                    displayText: 'project',
                    field: 'title',
                }
            ],
        }
    },
    methods: {
        edit(id) {
            this.$router.push(`${this.resource}/${id}/edit`)
        },
        showDiscovery(id) {
            this.$router.push(`${this.resource}/${id}`)
        },
        deleteControl(id) {
            console.log(id)
        },
        formSubmitted() {
            this.submit(this.form, (res) => {
                this.success()
                this.form = {
                    seed: null,
                    comment: null,
                    discovery_project_id: null,
                    discovery_project: null,
                    discovery_type_id: null,
                    discovery_type: null,
                }
                this.$refs.panel.reload();
            })
        },

        onDiscoveryTypeUpdate(e) {
            Vue.set(this.$data.form, 'discovery_type', e);
            Vue.set(this.$data.form, 'discovery_type_id', e.id);
        },
        addDiscoveryType() {
            Vue.set(this.$data, 'discoveryTypeModal', true)
        },
        submitDiscoveryType(bvModalEvt) {
            bvModalEvt.preventDefault()
            post('/api/discovery-types', this.discoveryTypeForm).then(res => {
                if (res.data.saved) {
                    this.resetDiscoveryTypeModal()
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: 'Success',
                            icon: 'BellIcon',
                            text: 'Discovery Type Added',
                            variant: 'success'
                        },
                    })
                    Vue.set(this.$data, 'discoveryTypeModal', false)
                }
            }).catch(error => {
                if (error.error.response.status === 422) {
                    this.discoveryTypeError = error.response.data.errors
                }
            })

        },
        resetDiscoveryTypeModal() {
            this.discoveryTypeForm = {
                title: null
            }
        },
        onDiscoveryProjectUpdate(e) {
            Vue.set(this.$data.form, 'discovery_project', e);
            Vue.set(this.$data.form, 'discovery_project_id', e.id);
        },
        addDiscoveryProject() {
            Vue.set(this.$data, 'discoveryProjectModal', true)
        },
        submitDiscoveryProject(bvModalEvt) {
            bvModalEvt.preventDefault()
            post('/api/discovery-projects', this.discoveryProjectForm).then(res => {
                if (res.data.saved) {
                    this.resetDiscoveryProjectModal()
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: 'Success',
                            icon: 'BellIcon',
                            text: 'Discovery Project Added',
                            variant: 'success'
                        },
                    })
                    Vue.set(this.$data, 'discoveryProjectModal', false)
                }
            }).catch(error => {
                if (error.response.status === 422) {
                    this.tagTypeError = error.response.data.errors
                }
            })

        },
        resetDiscoveryProjectModal() {
            this.discoveryTypeForm = {
                title: null
            }
        },
    },
}
</script>

<style scoped>

</style>
