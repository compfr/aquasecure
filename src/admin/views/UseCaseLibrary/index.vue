<template>
    <div>
        <b-card title="Search Use Case Library">
            <b-row>
                <b-col md="3">
                    <b-form-group
                        label="Category"
                    >
                        <x-tag-input :positionRelative="true" :removable="true" keyIndex="category_id"
                                     :multiple="true" :value="categories" relation="category"
                                     :resource="`/api/search/use_case_library_categories`" column="title" name="title"
                                     @input="onCategoryUpdate">
                        </x-tag-input>
                    </b-form-group>
                </b-col>
                <b-col md="3">
                    <b-form-group
                        label="Api Type"
                    >
                        <x-tag-input :positionRelative="true" :removable="true" keyIndex="api_type_id"
                                     :multiple="true" :value="api_types" relation="api_type"
                                     :resource="`/api/search/api_types`" column="title" name="title"
                                     @input="onApiTypeUpdate">
                        </x-tag-input>
                    </b-form-group>
                </b-col>
                <b-col md="4">
                    <b-form-group
                        label="Search"
                    >
                        <b-form-input
                            placeholder="Search"
                            v-model="additionalParams.q"
                        />
                    </b-form-group>
                </b-col>
                <b-col md="2">
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1 mt-2"
                        @click="searchUseCaseLibrary"
                    >
                        Search
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Use Case Library</h3>
                </b-col>
                <b-col md="6">
                    <b-button @click="openSideBar('Add', 0)" class="mr-1 float-right mb-1" variant="primary">
                        <feather-icon icon="PlusIcon" size="14"/>
                        Create
                    </b-button>
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1 mb-1 float-right"
                        @click="importUseCase"
                    >
                        Import
                    </b-button>
                </b-col>
            </b-row>
            <panel ref="panel" :url-api="urlApi" :columns="columns" :resource="resource"
                   :additional-params="additionalParams">
                <div slot="action" slot-scope="props" class="text-nowrap">
                    <feather-icon
                        :id="`user-row-${props.item.id}-eye-icon`"
                        icon="EyeIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="openShowSideBar(props.item.id)"
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
                <div slot="api_type" slot-scope="props" class="text-nowrap">
                    <template v-if="props.item.queries.length > 0">
                        <b-badge variant="primary" class="mr-1"
                                 v-for="(item,index) in props.item.queries" :key="index">
                            {{ item.api_type.title}}
                        </b-badge>
                    </template>
                </div>
            </panel>
        </b-card>

        <b-sidebar id="sidebar-backdrop"
                   backdrop-variant="dark" @hidden="resetUseCaseForm"
                   backdrop :title="`${formType} Use Case`" right shadow width="70%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <UseCaseLibraryForm v-if="showFormSideBar" :form-type="formType" :form-id="selectedUseCase" @cancel="closeSideBar" @close="saveCloseSideBar"/>
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-sidebar id="sidebar-backdrop-1"
                   backdrop-variant="dark" @hidden="resetShow"
                   backdrop :title="`Use Case Detail`" right shadow width="70%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <ShowUseCaseLibrary v-if="showSideBar" :form-id="selectedUseCase" />
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-modal
            v-model="importUseCaseModal"
            id="modal-prevent-closing"
            title="Import Use Case"
            ok-title="Save"
            cancel-variant="outline-secondary"
            @hidden="resetUseCaseModal"
            @ok="handleUseCaseOk">
            <b-form-group>
                <b-form-file
                    @input="handleUseCaseFile"
                    placeholder="Choose a XLSX or CSV File "
                    drop-placeholder="Drop file here..."
                />
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
        BFormGroup,
        BFormInput, BBadge, BFormFile, BModal, VBModal
    } from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import {get, post} from '@/libs/api.js'
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import {form} from "@/libs/mixins";
    import XTagInput from "@/components/Form/TagInput";
    import {objectToFormData} from "@/libs/helpers";
    import UseCaseLibraryForm from "@/admin/views/UseCaseLibrary/UseCaseLibraryForm";
    import ShowUseCaseLibrary from "@/admin/views/UseCaseLibrary/ShowUseCaseLibrary";

    export default {
        components: {
            ShowUseCaseLibrary,
            UseCaseLibraryForm,
            XTagInput,
            BFormGroup,
            BFormInput,
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
            BFormFile,
            BModal
        },
        directives: {
            Ripple
        },
        name: "UseCaseIndex",
        mixins: [form],
        data() {
            return {
                model: null,
                urlApi: "/api/use_case_libraries",
                resource: "/use-case-libraries",
                importUseCaseLibraryModal: false,
                import_data: {},
                selectedUseCase:null,
                showSideBar: false,
                showFormSideBar: false,
                formType: 'Create',
                importUseCaseModal: false,
                import_use_case_data: {},
                multiSelect: {
                    frameworks: []
                },
                additionalParams: {
                    q: '',
                    categories: [],
                    api_types: []
                },
                categories: [],
                api_types: [],
                columns: [
                    {
                        label: 'ID',
                        field: 'ref_id',
                    },
                    {
                        label: 'Name',
                        field: 'name',
                    },
                    {
                        label: 'Category',
                        displayText: 'category',
                        field: 'title'
                    },
                    {
                        label: 'Api Type',
                        field: 'api_type',
                        custom: true
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
                this.openSideBar('Edit', id);
                // this.$router.push(`${this.resource}/${id}/edit`)
            },
            showControl(id) {
                this.$router.push(`${this.resource}/${id}`)
            },
            deleteControl(id) {
                console.log(id)
            },
            searchUseCaseLibrary() {
                this.$refs.panel.reload();
            },
            openSideBar(formType, id){
                this.formType = formType;
                this.selectedUseCase = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = true;
            },
            resetUseCaseForm(){
                this.showFormSideBar = false;
            },
            closeSideBar(){
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showSideBar = false;
            },
            saveCloseSideBar(){
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showSideBar = false;
                this.$refs.panel.update();
            },
            openShowSideBar(id) {
                this.selectedUseCase = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-1')
                this.showSideBar = true;
            },
            onCategoryUpdate(e){
                Vue.set(this.$data.additionalParams,'categories', []);
                Vue.set(this.$data,'categories', e);
                for(var i=0; i<e.length;i++){
                    this.additionalParams.categories.push(e[i].category_id)
                }
            },
            onApiTypeUpdate(e){
                Vue.set(this.$data.additionalParams,'api_types', []);
                Vue.set(this.$data,'api_types', e);
                for(var i=0; i<e.length;i++){
                    this.additionalParams.api_types.push(e[i].api_type_id)
                }
            },

            resetShow() {
                this.showSideBar = false;
            },
            handleUseCaseOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                this.updateUseCase()
            },
            resetUseCaseModal() {
                this.import_use_case_data = {}
            },
            importUseCase() {
                this.import_use_case_data = {}
                Vue.set(this.$data, 'importUseCaseModal', true)
            },
            updateUseCase() {
                post('/api/use-case-import', objectToFormData(this.import_use_case_data)).then(res => {
                    if (res.data.saved) {
                        this.resetUseCaseModal()
                        Vue.set(this.$data, 'importUseCaseModal', false)
                        this.success();
                        this.$refs.panel.reload();
                        // this.reload()
                    }
                })
            },
            handleUseCaseFile(e) {
                Vue.set(this.$data.import_use_case_data, 'file', e)
            }
        },
    }
</script>

<style scoped>

</style>
