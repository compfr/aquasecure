<template>
    <div v-if="show">
        <b-card title="Search Tags">
            <b-row>
                <b-col md="10">
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
                        style="margin-top: 1.9rem !important;"
                        @click="searchTags"
                    >
                        Search
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Tags</h3>
                </b-col>
                <b-col cols="6">
                    <b-button @click="openSideBar('Add', 0)" class="mr-1 float-right mb-1" variant="primary">
                        <feather-icon icon="PlusIcon" size="14"/>
                        Create
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
                    <feather-icon
                        :id="`user-row-${props.item.id}-edit-icon`"
                        icon="EditIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="edit(props.item.id)"
                    />
                </div>
            </panel>
        </b-card>
        <b-sidebar id="sidebar-backdrop"
                   backdrop-variant="dark" @hidden="resetTagForm"
                   backdrop :title="`${formType} Tag`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <TagForm v-if="showFormSideBar" :form-type="formType" :form-id="selectedTag"
                                 :tag_type="tagTypeId" @cancel="closeSideBar" @close="saveCloseSideBar"/>
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-sidebar id="sidebar-backdrop-1"
                   backdrop-variant="dark" @hidden="resetShow"
                   backdrop :title="`Tag Detail`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <TagShow v-if="showSideBar" :form-id="selectedTag"/>
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
        BModal,
        VBModal,
        BFormGroup,
        BFormInput, BBadge, BSidebar
    } from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import {form} from "@/libs/mixins";
    import XTagInput from "@/components/Form/TagInput";
    import TagForm from "@/tenant/views/Tags/TagForm";
    import TagShow from "@/tenant/views/Tags/TagShow";

    export default {
        components: {
            TagShow,
            TagForm,
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
            BBadge, BSidebar
        },
        directives: {
            'b-modal': VBModal,
            Ripple
        },
        name: "GRCTags",
        mixins: [form],
        props: {
            tagTypeId: {
                required: true
            }
        },
        data() {
            return {
                model: null,
                show: false,
                urlApi: "/api/tags?tag_type=2",
                resource: "/tags",
                additionalParams: {
                    q: ''
                },
                selectedTag: null,
                showFormSideBar: false,
                showSideBar: false,
                formType: 'Create',
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
                        label: 'Detail',
                        field: 'detail',
                    },
                    {
                        label: 'Description',
                        field: 'desc',
                    },
                    {
                        label: 'Action',
                        field: 'action',
                        action: true
                    }
                ],
            }
        },
        created() {
            this.urlApi = `/api/tags?tag_type=${this.tagTypeId}`
            this.show = true
        },
        methods: {
            edit(id) {
                this.openSideBar('Edit', id);
                // this.$router.push(`${this.resource}/${id}/edit`)
            },
            showTag(id) {
                this.$router.push(`${this.resource}/${id}`)
            },
            deleteTag(id) {
                console.log(id)
            },
            searchTags() {
                this.$refs.panel.reload();
            },
            openSideBar(formType, id) {
                this.formType = formType;
                this.selectedTag = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = true;
            },
            resetTagForm() {
                this.showFormSideBar = false;
            },
            closeSideBar() {
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = false;
            },
            saveCloseSideBar() {
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = false;
                this.$refs.panel.update();
            },
            openShowSideBar(id) {
                this.selectedTag = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-1')
                this.showSideBar = true;
            },

            resetShow() {
                this.showSideBar = false;
            },
        },
    }
</script>

<style scoped>

</style>
