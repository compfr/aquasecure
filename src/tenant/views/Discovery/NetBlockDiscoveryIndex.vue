<template>
    <div>
        <b-card>
            <b-row>
                <b-col md="6">
                    <h3>Net Blocks</h3>
                </b-col>
                <b-col md="6">
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1 mb-1 float-right"
                        @click="importDomain"
                    >
                        Import
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
        <b-card v-if="records.length > 0">
            <b-row>
                <b-col cols="12">
                    <table class="table table-striped table-hover">
                        <thead>
                        <template v-for="(item, index) in columns">
                            <th>{{item}}</th>
                        </template>
                            <th>
                                Project
                            </th>
                        </thead>
                        <tbody>
                        <template v-for="(event, index) in records">
                            <tr>
                                <template v-for="(field, fIndex) in columns">
                                    <td>{{ event.raw_data[field] }}</td>
                                </template>
                                <td>
                                    {{event.project.title}}
                                </td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </b-col>
            </b-row>
        </b-card>

        <b-modal
            v-model="importDomainModal"
            id="modal-prevent-closing"
            title="Import Domain"
            ok-title="Save"
            cancel-variant="outline-secondary"
            @hidden="resetDomainModal"
            @ok="handleDomainOk">
            <b-row>
                <b-col cols="12" class="mb-2">
                    <b-form-group
                        label="Project"
                    >
                        <x-tag-input :value="import_domain_data.project" :resource="`/api/search/discovery-projects`"
                                     column="title"
                                     name="title"
                                     @input="onProjectUpdate">
                        </x-tag-input>
                    </b-form-group>
                </b-col>
                <b-col cols="12">
                    <b-form-group label="JSON File">
                        <b-form-file
                            @input="handleDomainFile"
                            placeholder="Choose a JSON File "
                            drop-placeholder="Drop file here..."
                        />
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
    import DomainForm from "@/tenant/views/Domains/DomainForm";
    import ShowDomain from "@/tenant/views/Domains/ShowDomain.vue";
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
        name: "NetBlockDiscoveryIndex",
        mixins: [form],
        data() {
            return {
                records: [],
                columns: [
                ],
                importDomainModal: false,
                import_domain_data: {
                    project: null,
                    project_id: null,
                    file: null
                },
                additionalParams: {
                    q: '',
                },

            }
        },
        created() {
            this.reload()
        },
        methods: {
            reload() {
                get('/api/discovery-net-blocks').then((res) => {
                    this.records = res.data.data;
                    this.columns = Object.keys(this.records[0].raw_data)
                })
            },
            onProjectUpdate(e) {
                Vue.set(this.$data.import_domain_data, 'project', e);
                Vue.set(this.$data.import_domain_data, 'project_id', e.id);
            },
            handleDomainOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                this.updateDomain()
            },
            resetDomainModal() {
                this.import_domain_data = {
                    project: null,
                    project_id: null,
                    file: null
                }
            },
            importDomain() {
                this.import_domain_data = {
                    project: null,
                    project_id: null,
                    file: null
                }
                Vue.set(this.$data, 'importDomainModal', true)
            },
            updateDomain() {
                post('/api/discovery-net-blocks', objectToFormData(this.import_domain_data)).then(res => {
                    if (res.data.saved) {
                        this.resetDomainModal()
                        Vue.set(this.$data, 'importDomainModal', false)
                        this.reload()
                    }
                })
            },
            handleDomainFile(e) {
                Vue.set(this.$data.import_domain_data, 'file', e)
            }
        },
    }
</script>

<style scoped>

</style>
