<template>
    <div v-if="show">
        <b-card title="Task Users">
            <b-row>
                <b-col md="6">
                    <div v-if="hasAdminRole" class="position-top-0 position-right-0 position-absolute px-1" @click="addUser">
                        <small>Add New</small>
                    </div>
                    <b-form-group label="Project Owners">
                        <x-tag-input :positionRelative="true" :disabled="!hasAdminRole" :removable="true" keyIndex="user_id"
                                     :multiple="true" :value="form.project_owners" relation="user"
                                     :resource="`/api/search/users?role=Admin`" column="title" name="name"
                                     @input="onTagMultiUpdate($event,'project_owners')"/>
                        <error :error="error.project_owners"/>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <div v-if="hasAdminRole" class="position-top-0 position-right-0 position-absolute px-1" @click="addUser">
                        <small>Add New</small>
                    </div>
                    <b-form-group label="Implementors">
                        <x-tag-input :positionRelative="true" :disabled="!hasAdminRole" :removable="true" keyIndex="user_id"
                                     :multiple="true" :value="form.implementors" relation="user"
                                     :resource="`/api/search/users?role=Implementor`" column="title" name="name"
                                     @input="onTagMultiUpdate($event,'implementors')"/>
                        <error :error="error.implementors"/>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <div v-if="hasAdminRole" class="position-top-0 position-right-0 position-absolute px-1" @click="addUser">
                        <small>Add New</small>
                    </div>
                    <b-form-group label="Internal Auditors">
                        <x-tag-input :positionRelative="true" :disabled="!hasAdminRole" :removable="true" keyIndex="user_id"
                                     :multiple="true" :value="form.internal_auditors" relation="user"
                                     :resource="`/api/search/users?role=Internal Audit`" column="title" name="name"
                                     @input="onTagMultiUpdate($event,'internal_auditors')"/>
                        <error :error="error.internal_auditors"/>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <div v-if="hasAdminRole" class="position-top-0 position-right-0 position-absolute px-1" @click="addUser">
                        <small>Add New</small>
                    </div>
                    <b-form-group label="External Auditors">
                        <x-tag-input :positionRelative="true" :disabled="!hasAdminRole" :removable="true" keyIndex="user_id"
                                     :multiple="true" :value="form.external_auditors" relation="user"
                                     :resource="`/api/search/users?role=External Audit`" column="title" name="name"
                                     @input="onTagMultiUpdate($event,'external_auditors')"/>
                        <error :error="error.external_auditors"/>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-card>
        <b-card>
            <b-row>
                <b-col md="6">
                    <b-form-group label="Task Type">
                        <x-tag-input :value="form.task_type" :disabled="true" :resource="`/api/search/task_types`"
                                     column="title" name="title"
                                     @input="onTaskTypeUpdate"/>
                        <error :error="error.task_type_id"/>
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group label="Source">
                        <b-form-input placeholder="Source" :disabled="true" v-model="form.source"/>
                        <error :error="error.source"/>
                    </b-form-group>
                </b-col>

                <b-col md="12">
                    <b-form-group label="Description">
                        <b-form-textarea v-model="form.description" :disabled="true"/>
                        <error :error="error.description"/>
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group label="Status">
                        <x-tag-input :value="form.operation_status" :resource="`/api/search/operation_status`"
                                     column="title" name="title"
                                     @input="onStatusUpdate"/>
                        <error :error="error.status_id"/>
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group label="Urgency">
                        <x-tag-input :value="form.operation_urgency" :resource="`/api/search/operation_urgency`"
                                     column="title" name="title"
                                     @input="onUrgencyUpdate"/>
                        <error :error="error.urgency_id"/>
                    </b-form-group>
                </b-col>

                <b-col md="4" v-if="formEditFrom == 'ProjectDetail'">
                    <b-form-group label="Applicable ?">
                        <b-form-select v-model="form.applicable"
                                       :options="[{text: 'Yes', value : '1'}, {text: 'No', value : '0'}]"/>
                        <error :error="error.applicable"/>
                    </b-form-group>
                </b-col>

                <b-col md="4">
                    <b-form-group label="Due Time">
                        <flat-pickr v-model="form.due_time" class="form-control"
                                    :config="{ enableTime: true, noCalendar: false, dateFormat: 'Y-m-d H:i:ss', }"/>
                        <error :error="error.due_time"/>
                    </b-form-group>
                </b-col>


                <template v-if="formEditFrom == 'ProjectDetail'">
                    <b-col md="4" v-if="form.stage == 0">
                        <b-form-group :label="`Progress (${form.project_owner_progress})`">
                            <vue-slider
                                v-model="form.project_owner_progress"
                                :min="0"
                                :max="100"
                                :interval="20"
                            />
                        </b-form-group>
                    </b-col>
                    <b-col md="4" v-if="form.stage == 1">
                        <b-form-group :label="`Progress (${form.owner_progress})`">
                            <!-- slider -->
                            <vue-slider
                                v-model="form.owner_progress"
                                :min="0"
                                :max="100"
                                :interval="20"
                            />
                        </b-form-group>
                    </b-col>
                    <b-col md="4" v-if="form.stage == 2">
                        <b-form-group :label="`Progress (${form.internal_audit_progress})`">
                            <!-- slider -->
                            <vue-slider
                                v-model="form.internal_audit_progress"
                                :min="0"
                                :max="100"
                                :interval="20"
                            />
                        </b-form-group>
                    </b-col>
                    <b-col md="4" v-if="form.stage == 3">
                        <b-form-group :label="`Progress (${form.external_audit_progress})`">
                            <!-- slider -->
                            <vue-slider
                                v-model="form.external_audit_progress"
                                :min="0"
                                :max="100"
                                :interval="20"
                            />
                        </b-form-group>
                    </b-col>
                </template>


                <!--                <b-col md="12">-->
                <!--                    <b-form-group label="Comments">-->
                <!--                        <b-form-textarea v-model="form.comments"/>-->
                <!--                        <error :error="error.comments"/>-->
                <!--                    </b-form-group>-->
                <!--                </b-col>-->
            </b-row>

        </b-card>

        <template v-if="formEditFrom == 'ProjectDetail'">
            <b-card-actions action-collapse collapsed title="GRC" :count="form.field_data.length">
                <b-row>
                    <template v-for="(item, index) in form.field_data">
                        <b-col cols=11 class="mb-1 border-bottom">
                            <p>
                                <span style="font-weight: bold">{{item.field.title}}: </span><span>{{item.value}}</span>,
                                <span style="font-weight: bold">User: </span><span>{{item.user.name}}</span>
                            </p>
                        </b-col>
                        <b-col cols="1">
                            <b-button v-if="!item.operation_id" variant="danger" class="btn btn-sm btn-outline"
                                      @click="removeOperationField(index)">
                                <feather-icon icon="TrashIcon" size="14"/>
                            </b-button>
                        </b-col>
                    </template>
                </b-row>
                <b-row class="align-items-center">
                    <b-col md="4">
                        <b-form-group
                            label="Field"
                        >
                            <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewField">
                                <small>Add New</small>
                            </div>
                            <x-tag-input :value="operation_field_data.field" :resource="`/api/search/operation_fields`"
                                         column="title" name="title" @input="onOperationFieldUpdate"/>
                        </b-form-group>
                    </b-col>
                    <b-col md="7">
                        <b-form-group
                            label="Value"
                        >
                            <b-form-input v-model="operation_field_data.value"/>
                        </b-form-group>
                    </b-col>

                    <b-col md="1">
                        <b-button variant="primary" class="btn btn-sm btn-outline"
                                  @click="addOperationField">
                            <feather-icon icon="PlusIcon" size="14"/>
                        </b-button>
                    </b-col>
                </b-row>
            </b-card-actions>

            <b-card-actions action-collapse collapsed title="Assets" :count="form.assets.length">
                <b-row class="align-items-center">
                    <template v-for="(item, aIndex) in form.assets">
                        <b-col cols="11" class="mb-1 border-bottom">
                            <p>
                                <template v-for="(value, key, kIndex) in item.record">
                                    <template v-if="key.toLowerCase() != 'tag' && key.toLowerCase() != 'asset_id'">
                                        <span style="font-weight: bold">{{key}}: </span><span>{{value}}</span><span
                                        v-if="kIndex < Object.keys(item.record).length-1">, </span>
                                    </template>
                                </template>
                            </p>
                        </b-col>
                        <b-col cols="1">
                            <b-button variant="danger" class="btn btn-sm btn-outline"
                                      @click="removeAsset(aIndex)">
                                <feather-icon icon="TrashIcon" size="14"/>
                            </b-button>
                        </b-col>
                    </template>
                    <b-col md="3">
                        <b-form-group
                            label="Asset Type"
                        >
                            <x-tag-input :value="asset_form.asset_type" :resource="`/api/search/asset_types`"
                                         column="title" name="title" @input="onAssetFormTypeUpdate"/>
                        </b-form-group>
                    </b-col>
                    <b-col md="3">
                        <b-form-group
                            label="Column"
                        >
                            <x-tag-input :value="asset_form.column_obj" :resource="`/api/search/asset_inventory_keys`"
                                         :params="{asset_type_id: asset_form.asset_type_id}"
                                         :disabled="(asset_form.asset_type == null) ? true : false"
                                         name="text" @input="onAssetFormColumnUpdate"/>
                        </b-form-group>
                    </b-col>
                    <b-col md="5">
                        <b-form-group
                            label="Record"
                        >
                            <x-tag-input :value="asset_form.data" :resource="`/api/search/asset_inventory`"
                                         :params="{asset_type_id: asset_form.asset_type_id, column: asset_form.column}"
                                         :disabled="(asset_form.asset_type == null || asset_form.column == null) ? true : false"
                                         :name="asset_form.column" @input="onAssetRecordUpdate"/>
                        </b-form-group>
                    </b-col>
                    <b-col md="1">
                        <b-button variant="primary" class="btn btn-sm btn-outline"
                                  @click="addAsset">
                            <feather-icon icon="PlusIcon" size="14"/>
                        </b-button>
                    </b-col>
                    <!--                </template>-->
                </b-row>
            </b-card-actions>

            <b-card-actions action-collapse collapsed title="Evidences" :count="form.documents.length">
                <b-row>
                    <template v-for="(item, index) in form.documents">
                        <b-col cols=11 class="mb-1 border-bottom">
                            <p>
                                <span style="font-weight: bold">Tag: </span><span>{{item.tag.name}}</span>,
                                <span style="font-weight: bold">Document: </span><b-link :href="`/attachment/${item.document.document}`" target="_blank">{{item.document.filename}}</b-link>
                            </p>
                        </b-col>
                        <b-col cols="1">
                            <b-button variant="danger" class="btn btn-sm btn-outline"
                                      @click="removeOperationEvidence(index)">
                                <feather-icon icon="TrashIcon" size="14"/>
                            </b-button>
                        </b-col>
                    </template>
                </b-row>
                <b-row class="align-items-center">
                    <b-col md="5">
                        <b-form-group
                            label="Tag"
                        >
                            <x-tag-input :value="document_field.tag" :resource="`/api/search/evidence_tags`"
                                         name="name" @input="onOperationDocumentTagUpdate"/>
                        </b-form-group>
                    </b-col>
                    <b-col md="5">
                        <b-form-group
                            label="Document"
                        >
                            <x-tag-input :value="document_field.document" :disabled="document_field.tag == null" :params="{tag_id: document_field.tag_id}" :resource="`/api/search/evidence_tag_documents`"
                                         name="filename" @input="onOperationDocumentFileUpdate"/>
                        </b-form-group>
                    </b-col>
                    <b-col md="2">
                        <b-button variant="primary" class="btn btn-sm btn-outline"
                                  @click="addOperationDocument">
                            <feather-icon icon="PlusIcon" size="14"/>
                        </b-button>
                    </b-col>
                </b-row>
            </b-card-actions>

            <b-card-actions action-collapse collapsed title="Tags" :count="form.tags.length">
                <b-row>
                    <template v-for="(item, index) in form.tags">
                        <b-col cols=5 class="mb-1 border-bottom">
                            <p>
                                <span style="font-weight: bold">Tag Type: </span><span>{{item.tag_type?.title}}</span>
                            </p>
                        </b-col>
                        <b-col cols=6 class="mb-1 border-bottom">
                            <p>
                                <span style="font-weight: bold">Tag: </span><span>{{item.name}}</span>
                            </p>
                        </b-col>
                        <b-col cols="1">
                            <b-button variant="danger" class="btn btn-sm btn-outline"
                                      @click="removeOperationTag(index)">
                                <feather-icon icon="TrashIcon" size="14"/>
                            </b-button>
                        </b-col>
                    </template>
                </b-row>
                <b-row class="align-items-center">
                    <b-col md="5">
                        <b-form-group
                            label="Tag Type"
                        >
                            <x-tag-input :value="tag.tag_type" :resource="`/api/search/tag_type`"
                                         name="title" @input="onOperationTagTypeUpdate"/>
                        </b-form-group>
                    </b-col>
                    <b-col md="5">
                        <b-form-group
                            label="Tag"
                        >
                            <x-tag-input :value="tag.tag" :disabled="tag.tag_type == null" :params="{tag_type: tag.tag_type_id}" :resource="`/api/search/tags`"
                                         name="name" @input="onOperationTagUpdate"/>
                        </b-form-group>
                    </b-col>
                    <b-col md="2">
                        <b-button variant="primary" class="btn btn-sm btn-outline"
                                  @click="addOperationTag">
                            <feather-icon icon="PlusIcon" size="14"/>
                        </b-button>
                    </b-col>
                </b-row>
            </b-card-actions>

            <b-card-actions action-collapse collapsed title="Reports">
                <b-row>
                    <b-col md="6">
                        <b-form-group label="Log Reference">
                            <x-tag-input :positionRelative="true" :removable="true" keyIndex="report_id"
                                         :multiple="true" :value="form.reports" relation="report"
                                         :resource="`/api/search/reports`" name="title"
                                         @input="onTagMultiUpdate($event,'reports')"/>
                            <error :error="error.reports"/>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-card-actions>

            <b-card-actions action-collapse collapsed title="Questionnaires" :count="form.questionnaires.length">
                <template v-for="(item,index) in form.questionnaires">
                    <b-row class="align-items-center">
                        <b-col md="12">
                            <b-form-group :label="item.tag.desc">
                                <b-form-textarea v-model="item.notes"/>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <hr />
                </template>
            </b-card-actions>

            <b-row class="mb-2">
                <b-col>
                    <template v-if="form.task_reviewed == 0">
                        <b-button v-if="form.stage == 0" :disabled="form.project_owner_progress < 100"
                                  type="submit" variant="primary" class="mr-1"
                                  @click="stageUpdateFormSubmitted(1)">
                            Proceed to Stage 1
                        </b-button>
                        <b-button v-if="form.stage == 1" :disabled="form.owner_progress < 100"
                                  type="submit" variant="primary" class="mr-1"
                                  @click="stageUpdateFormSubmitted(2)">
                            Proceed to Stage 2
                        </b-button>
                        <b-button v-if="form.stage == 2" :disabled="form.internal_audit_progress < 100"
                                  type="submit" variant="primary" class="mr-1"
                                  @click="stageUpdateFormSubmitted(3)">
                            Proceed to Stage 3
                        </b-button>
                        <b-button v-if="form.stage == 3" :disabled="form.external_audit_progress < 100"
                                  type="submit" variant="primary" class="mr-1"
                                  @click="stageUpdateFormSubmitted(4)">
                            Proceed to Stage 4
                        </b-button>
                    </template>
                    <template v-else>
                        <b-button v-if="form.stage > 0 && form.stage < 4"
                                  type="submit" variant="primary" class="mr-1"
                                  @click="stageUpdateFormSubmitted(4)">
                            Proceed
                        </b-button>
                        <b-button v-if="form.stage == 4"
                                  type="submit" variant="primary" class="mr-1"
                                  @click="completeFormSubmitted">
                            Complete
                        </b-button>
                    </template>

                    <b-button type="submit" variant="primary" class="mr-1"
                              @click="formSubmitted">
                        Update
                    </b-button>
                </b-col>
            </b-row>

            <b-card title="Task Move Back" v-if="(form.stage > 0 && form.task_reviewed == 0) || form.stage == 4">
                <b-row class="align-items-center">
                    <b-col md="6">
                        <b-form-select v-if="form.stage == 1" v-model="moveBackStage"
                                       :options="[{text: 'Select', value: null}, {text: 'Stage 0', value: 0}]"/>
                        <b-form-select v-if="form.stage == 2" v-model="moveBackStage"
                                       :options="[{text: 'Select', value: null}, {text: 'Stage 0', value: 0}, {text: 'Stage 1', value: 1}]"/>
                        <b-form-select v-if="form.stage == 3" v-model="moveBackStage"
                                       :options="[{text: 'Select', value: null}, {text: 'Stage 0', value: 0}, {text: 'Stage 1', value: 1}, , {text: 'Stage 2', value: 2}]"/>
                        <b-form-select v-if="form.stage == 4" v-model="moveBackStage"
                                       :options="[{text: 'Select', value: null},{text: 'Stage 1', value: 1}, {text: 'Stage 2', value: 2}, {text: 'Stage 3', value: 3}]"/>
                    </b-col>
                    <b-col md="6">
                        <b-button :disabled="moveBackStage == null" type="submit"
                                  variant="primary" class="mr-1"
                                  @click="moveBackTask">
                            Move Back
                        </b-button>
                    </b-col>
                </b-row>
            </b-card>
            <b-modal
                v-model="userModal"
                id="modal-project-owner"
                title="Add New User"
                ok-title="Submit"
                cancel-variant="outline-secondary"
                @hidden="resetUserModal"
                @ok="submitUser">

                <b-form-group
                    label="Name"
                >
                    <b-form-input
                        placeholder="Name"
                        v-model="userForm.name"
                    />
                    <error :error="userError.name"/>
                </b-form-group>

                <b-form-group
                    label="Email"
                >
                    <b-form-input
                        placeholder="Email"
                        v-model="userForm.email"
                    />
                    <error :error="userError.email"/>
                </b-form-group>

                <b-form-group
                    label="Roles"
                >
                    <x-tag-input :positionRelative="true" :removable="true" :multiple="true"
                                 :value="userForm.roles" keyIndex="id"
                                 :resource="`/api/get_roles`" column="title" name="name"
                                 @input="onRolesUpdate">
                    </x-tag-input>
                    <error :error="userError.roles"/>
                </b-form-group>
            </b-modal>
            <b-modal
                v-model="operationFieldModal"
                id="modal-framework-type"
                title="Add New Operation Field"
                ok-title="Submit"
                cancel-variant="outline-secondary"
                @hidden="resetOperationField"
                @ok="submitOperationField">

                <b-form-group
                    label="Title"
                >
                    <b-form-input
                        placeholder="Title"
                        v-model="operationFieldForm.title"
                    />
                    <error :error="operationFieldError.title"/>
                </b-form-group>
            </b-modal>
        </template>
        <template v-else>
            <b-button type="submit" variant="primary" class="mr-1"
                      @click="formSubmitted">
                Update
            </b-button>
        </template>

    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BCardText,
        BLink,
        BRow,
        BCol,
        BFormInput,
        BFormGroup,
        BFormCheckbox,
        BButton,
        BFormTextarea,
        BFormSelect,
        BModal
    } from 'bootstrap-vue'
    import {form} from "@/libs/mixins";
    import {get, post} from '@/libs/api'
    import VueSlider from 'vue-slider-component'
    import Error from "@/components/Form/Error";
    import Ripple from "vue-ripple-directive";
    import flatPickr from 'vue-flatpickr-component';
    import XTagInput from "@/components/Form/TagInput";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import BCardActions from "@core/components/b-card-actions/BCardActions";
    import {hasGuardRole} from "@/libs/helpers";

    export default {
        name: "EditOperation",
        mixins: [form],
        components: {
            XTagInput,
            VueSlider,
            Error,
            BCard,
            BCardActions,
            BCardText,
            BLink,
            BRow,
            BCol,
            BFormInput,
            BFormGroup,
            BFormCheckbox,
            BButton,
            BFormTextarea,
            BFormSelect,
            flatPickr,
            BModal
        },
        directives: {
            Ripple
        },
        props: {
            formId: Number,
            formEditFrom: {
                type: String,
                default: 'Assignments'
            },
        },
        computed: {
            hasAdminRole(){
                return hasGuardRole('Admin')
            }
        },

        created() {
            get(`/api/my-assignment/${this.formId}/edit`).then((res) => {
                console.log(res)

                this.setData(res);
            })
        },
        data() {
            return {
                selected: [],
                show: false,
                resource: '/my-assignment',
                store: '/api/open-case',
                method: 'POST',
                title: 'Add',
                message: 'New OpenCase Added',
                permissions: [],
                moveBackStage: null,
                asset_form: {
                    asset_type: null,
                    asset_type_id: null,
                    column_obj: null,
                    column: null,
                    data: null
                },
                document_field:{
                  tag_id: null,
                  tag: null,
                  document_id: null,
                  document: null
                },
                tag: {
                    id: null,
                    tag: null,
                    tag_type: null,
                    tag_type_id: null,
                },
                operation_field_data: {
                    field: null,
                    operation_field_id: null,
                    value: null,
                    user_id: window.apex.user.id,
                    user: {
                        name: window.apex.user.name
                    }
                },
                operationFieldModal: false,
                operationFieldForm: {
                    title: null
                },
                operationFieldError: {},
                userModal: false,
                userForm: {
                    name: null,
                    email: null,
                    roles: []
                },
                userError: {}
            }
        },
        methods: {
            setData(res) {
                Vue.set(this.$data, 'form', res.data.form);
                this.store = `/api/operation-update`;
                this.title = 'Edit';
                this.message = 'Assignment has been updated';
                this.show = true
            },

            completeFormSubmitted() {
                Vue.set(this.$data.form, 'task_completed', 1);
                this.submit(this.form, (res) => {
                    this.success()
                    this.$emit('close');
                })
            },

            stageUpdateFormSubmitted(stage) {
                Vue.set(this.$data.form, 'update_stage', stage);

                this.submit(this.form, (res) => {
                    this.success()
                    this.$emit('close');
                })
            },

            moveBackTask() {
                Vue.set(this.$data.form, 'update_stage', this.moveBackStage);
                this.submit(this.form, (res) => {
                    this.success()
                    this.$emit('close');
                })
            },

            formSubmitted() {
                this.submit(this.form, (res) => {
                    this.success()
                    this.$emit('close');
                })
            },

            onTagMultiUpdate(e, key) {
                Vue.set(this.$data.form, `${key}`, e)
            },

            onTaskTypeUpdate(e) {
                Vue.set(this.$data.form, 'task_type_id', e.id)
                Vue.set(this.$data.form, 'task_type', e)
            },

            onStatusUpdate(e) {
                Vue.set(this.$data.form, 'status_id', e.id)
                Vue.set(this.$data.form, 'operation_status', e)
            },
            onUrgencyUpdate(e) {
                Vue.set(this.$data.form, 'urgency_id', e.id)
                Vue.set(this.$data.form, 'operation_urgency', e)
            },
            cancelForm() {
                this.$emit('cancel');
            },
            addAsset() {
                if (this.asset_form.data != null) {
                    var idFound = false

                    for (var i = 0; i < this.form.assets.length; i++) {
                        if (this.form.assets[i].record_id == this.asset_form.data['$id']) {
                            idFound = true;
                            break;
                        }
                    }
                    if (!idFound) {
                        this.form.assets.push({
                            asset_type_id: this.asset_form.asset_type_id,
                            asset_id: this.asset_form.data['asset_id'],
                            record_id: this.asset_form.data['$id'],
                            record: this.asset_form.data,
                        });
                        Vue.set(this.$data.asset_form, 'asset_type', null);
                        Vue.set(this.$data.asset_form, 'asset_type_id', null);
                        Vue.set(this.$data.asset_form, 'column_obj', null);
                        Vue.set(this.$data.asset_form, 'column', null);
                        Vue.set(this.$data.asset_form, 'data', null);
                    } else {
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Error',
                                icon: 'BellIcon',
                                text: 'Asset Already Exist',
                                variant: 'danger'
                            },
                        })
                    }

                }
            },
            removeAsset(index) {
                this.form.assets.splice(index, 1);
            },
            onAssetFormTypeUpdate(e) {
                Vue.set(this.$data.asset_form, 'asset_type', e);
                Vue.set(this.$data.asset_form, 'asset_type_id', e.id);
                Vue.set(this.$data.asset_form, 'column_obj', null);
                Vue.set(this.$data.asset_form, 'column', null);
                Vue.set(this.$data.asset_form, 'data', null);
            },
            onAssetFormColumnUpdate(e) {
                Vue.set(this.$data.asset_form, 'column_obj', e);
                Vue.set(this.$data.asset_form, 'column', e.value);
            },
            onAssetRecordUpdate(e) {
                Vue.set(this.$data.asset_form, 'data', e);
            },
            onOperationFieldUpdate(e) {
                Vue.set(this.$data.operation_field_data, 'field', e);
                Vue.set(this.$data.operation_field_data, 'operation_field_id', e.id);
                Vue.set(this.$data.operation_field_data, 'value', null);
            },
            addOperationField() {
                this.form.field_data.push({
                    field: this.operation_field_data.field,
                    operation_field_id: this.operation_field_data.operation_field_id,
                    value: this.operation_field_data.value,
                    user_id: this.operation_field_data.user_id,
                    user: this.operation_field_data.user,
                });
                Vue.set(this.$data.operation_field_data, 'field', null);
                Vue.set(this.$data.operation_field_data, 'operation_field_id', null);
                Vue.set(this.$data.operation_field_data, 'value', null);
            },

            removeOperationField(index) {
                this.form.field_data.splice(index, 1);
            },

            addNewField() {
                Vue.set(this.$data, 'operationFieldModal', true)
            },
            submitOperationField(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/operation_fields', this.operationFieldForm).then(res => {
                    if (res.data.saved) {
                        this.resetOperationField()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Operation Field Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'operationFieldModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.operationFieldError = error.response.data.errors
                    }
                })

            },
            resetOperationField() {
                this.operationFieldForm = {
                    title: null
                }
            },
            removeOperationEvidence(index) {
                this.form.documents.splice(index, 1);
            },

            onOperationDocumentTagUpdate(e){
                Vue.set(this.$data.document_field, 'tag', e)
                Vue.set(this.$data.document_field, 'tag_id', e.id)
                Vue.set(this.$data.document_field, 'document', null)
                Vue.set(this.$data.document_field, 'document_id', null)
            },
            onOperationDocumentFileUpdate(e){
                Vue.set(this.$data.document_field, 'document', e)
                Vue.set(this.$data.document_field, 'document_id', e.id)
            },

            addOperationDocument() {
                if(this.document_field.tag_id == null){
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: 'Error',
                            icon: 'BellIcon',
                            text: 'Tag Not Selected',
                            variant: 'danger'
                        },
                    })
                    return 0;
                }
                if(this.document_field.document_id == null){
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: 'Error',
                            icon: 'BellIcon',
                            text: 'Document Not Selected',
                            variant: 'danger'
                        },
                    })
                    return 0;
                }
                for(var i=0;i<this.form.documents.length;i++){
                    if(this.form.documents[i]['document_id'] == this.document_field.document_id){
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Error',
                                icon: 'BellIcon',
                                text: 'Document Already Exist',
                                variant: 'danger'
                            },
                        })
                        return 0;
                    }

                }
                this.form.documents.push({
                    tag: this.document_field.tag,
                    tag_id: this.document_field.tag_id,
                    document: this.document_field.document,
                    document_id: this.document_field.document_id,
                });
                Vue.set(this.$data.document_field, 'tag', null);
                Vue.set(this.$data.document_field, 'tag_id', null);
                Vue.set(this.$data.document_field, 'document', null);
                Vue.set(this.$data.document_field, 'document_id', null);
            },

            removeOperationTag(index) {
                this.form.tags.splice(index, 1);
            },
            onOperationTagTypeUpdate(e){
                Vue.set(this.$data.tag, 'tag', null)
                Vue.set(this.$data.tag, 'id', null)
                Vue.set(this.$data.tag, 'tag_type', e)
                Vue.set(this.$data.tag, 'tag_type_id', e.id)
            },
            onOperationTagUpdate(e) {
                Vue.set(this.$data.tag, 'tag', e)
                Vue.set(this.$data.tag, 'id', e.id)
            },
            addOperationTag() {
                if(this.tag.id == null){
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: 'Error',
                            icon: 'BellIcon',
                            text: 'Tag Not Selected',
                            variant: 'danger'
                        },
                    })
                    return 0;
                }
                for(var i=0;i<this.form.tags.length;i++){
                    if(this.form.tags[i]['id'] === this.tag.id){
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Error',
                                icon: 'BellIcon',
                                text: 'Tag Already Exist',
                                variant: 'danger'
                            },
                        })
                        return 0;
                    }
                }
                let tag = this.tag.tag;
                tag.tag_type = this.tag.tag_type;

                this.form.tags.push(tag);
                Vue.set(this.$data.tag, 'tag', null)
                Vue.set(this.$data.tag, 'id', null)
                Vue.set(this.$data.tag, 'tag_type', null)
                Vue.set(this.$data.tag, 'tag_type_id', null)
            },

            addUser() {
                Vue.set(this.$data, 'userModal', true)
            },
            onRolesUpdate(e) {
                Vue.set(this.$data.form, 'roles', e)
            },
            submitUser(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/add_users', this.projectOwnerForm).then(res => {
                    if (res.data.saved) {
                        this.resetUserModal()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'User Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'userModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.userError = error.response.data.errors
                    }
                })
            },
            resetUserModal() {
                this.userForm = {
                    name: null,
                    email: null,
                    roles: []
                }
            },
        },
    }
</script>

<style scoped>
    .border-bottom {
        border-bottom: 1px black solid !important;
    }
</style>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
    @import '~@core/scss/vue/libs/vue-slider.scss';
</style>
