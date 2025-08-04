<template>
    <div>
        <b-row>
            <b-col md="6">
                <b-form-group
                    label="Name"
                >
                    <b-form-input
                        placeholder="Name"
                        v-model="form.name"
                    />
                    <error :error="error.name"/>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                    label="Detail"
                >
                    <b-form-input
                        placeholder="Detail"
                        v-model="form.detail"
                    />
                    <error :error="error.detail"/>
                </b-form-group>
            </b-col>
            <b-col cols="6">
                <div class="position-top-0 position-right-0 position-absolute px-1" @click="addTagCategory">
                    <small>Add New</small>
                </div>
                <b-form-group
                    label="Category"
                >
                    <x-tag-input :value="form.system_tag" :resource="`/api/search/system_tags`" column="title"
                                 name="title"
                                 @input="onCategoryUpdate">
                    </x-tag-input>
                </b-form-group>
            </b-col>
            <b-col cols="6">
                <!--                <div class="position-top-0 position-right-0 position-absolute px-1" @click="addTagType">-->
                <!--                    <small>Add New</small>-->
                <!--                </div>-->
                <b-form-group
                    label="Tag Type"
                >
                    <x-tag-input :disabled="true" :value="form.tag_type" :resource="`/api/search/tag_type`"
                                 column="title"
                                 name="title"
                                 @input="onTagTypeUpdate">
                    </x-tag-input>
                </b-form-group>
            </b-col>
            <b-col md="12">
                <b-form-group
                    label="Description"
                >
                    <b-form-textarea
                        placeholder="Description"
                        v-model="form.desc"
                    />
                    <error :error="error.desc"/>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row class="d-flex align-items-center">
            <b-col md="6">
                <h4>Attachments</h4>
            </b-col>
            <b-col md="6" class="d-flex justify-content-end">
                <b-button @click="addItem" variant="primary">
                    <feather-icon icon="PlusIcon" size="14"/>
                    Add
                </b-button>
            </b-col>
            <hr/>
        </b-row>
        <b-row>
            <b-col cols="12" class="mb-2">
                <template v-for="(item,index) in form.documents">
                    <b-row class="align-items-center">
                        <b-col cols="11" class="flex-column item-border-bottom my-1">
                            <template v-if="item.filename">
                                <b-card-text>Attachment: <b-link :href="`/attachment/${item.document}`" target="_blank">{{item.filename}}</b-link></b-card-text>
                            </template>
                            <b-form-group class="mt-1"
                            >
                                <b-form-file v-model="item.attachments"></b-form-file>
                            </b-form-group>
                        </b-col>
                        <b-col cols="1" v-if="form.documents.length > 1">
                            <b-button @click="removeItem(index)" variant="primary">
                                <feather-icon icon="TrashIcon" size="12"/>
                            </b-button>
                        </b-col>
                    </b-row>
                </template>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-button

                    type="submit"
                    variant="primary"
                    class="mr-1"
                    @click="formSubmitted"
                >
                    Submit
                </b-button>
                <b-button
                    v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                    type="reset"
                    variant="outline-secondary"
                    @click="cancelForm"
                >
                    Cancel
                </b-button>
            </b-col>
        </b-row>
        <b-modal
            v-model="tagCategoryModal"
            id="modal-category"
            title="Add New Tag Category"
            ok-title="Submit"
            cancel-variant="outline-secondary"
            @hidden="resetTagCategoryModal"
            @ok="submitTagCategory">

            <b-form-group
                label="Title"
            >
                <b-form-input
                    placeholder="Title"
                    v-model="tagCategoryForm.title"
                />
                <error :error="tagCategoryError.title"/>
            </b-form-group>
        </b-modal>
        <b-modal
            v-model="tagTypeModal"
            id="modal-tag-type"
            title="Add New Tag Type"
            ok-title="Submit"
            cancel-variant="outline-secondary"
            @hidden="resetTagTypeModal"
            @ok="submitTagType">

            <b-form-group
                label="Title"
            >
                <b-form-input
                    placeholder="Title"
                    v-model="tagTypeForm.title"
                />
                <error :error="tagTypeError.title"/>
            </b-form-group>
        </b-modal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BFormFile,
        BCard,
        BCardText,
        BLink,
        BRow,
        BCol,
        BFormInput,
        BFormGroup,
        BFormCheckboxGroup,
        BButton,
        BFormTextarea, BModal, VBModal
    } from 'bootstrap-vue'
    import {form} from "@/libs/mixins";
    import {get, post} from '@/libs/api'
    import Error from "@/components/Form/Error.vue";
    import Ripple from "vue-ripple-directive";
    import flatPickr from 'vue-flatpickr-component';
    import XTagInput from "@/components/Form/TagInput.vue";
    import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

    export default {
        name: "EvidenceTagForm",
        props: {
            formType: String,
            formId: Number,
            tag_type: String
        },
        mixins: [form],
        components: {
            XTagInput,
            Error,
            BFormFile,
            BCard,
            BCardText,
            BLink,
            BRow,
            BCol,
            BFormInput,
            BFormGroup,
            BFormCheckboxGroup,
            BButton, BFormTextarea, flatPickr, BModal
        },
        directives: {
            'b-modal': VBModal,
            Ripple
        },
        data() {
            return {
                show: false,
                resource: '/evidence_tags',
                store: '/api/evidence_tags',
                method: 'POST',
                title: 'Add',
                message: 'New Evidence Added',
                permissions: [],
                tagCategoryModal: false,
                tagCategoryForm: {
                    title: null
                },
                tagCategoryError: {},
                tagTypeModal: false,
                tagTypeForm: {
                    title: null
                },
                tagTypeError: {},
            }
        },
        created() {
            let urls = {
                'Add': `/api/evidence_tags/create?tag_type=${this.tag_type}`,
                'Edit': `/api/evidence_tags/${this.formId}/edit`
            };
            const url = urls[this.formType];
            get(url).then((res) => {
                this.setData(res);
            })
        },
        methods: {
            setData(res) {
                Vue.set(this.$data, 'form', res.data.form);

                if (this.formType === 'Edit') {
                    this.store = `/api/evidence_tags/${this.formId}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Evidence has been updated';
                }
                this.show = true
            },
            formSubmitted() {
                this.submitMultipartForm(this.form, (res) => {
                    this.success()
                    this.$emit('close');
                    // this.successfull(res)
                })
            },
            successfull(res) {
                this.$router.push(`${this.resource}`)
            },
            onCategoryUpdate(e) {
                Vue.set(this.$data.form, 'system_tag', e);
                Vue.set(this.$data.form, 'system_tag_id', e.id);
            },
            onTagTypeUpdate(e) {
                Vue.set(this.$data.form, 'tag_type', e);
                Vue.set(this.$data.form, 'tag_type_id', e.id);
            },
            addTagCategory() {
                Vue.set(this.$data, 'tagCategoryModal', true)
            },
            submitTagCategory(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/system_tags', this.tagCategoryForm).then(res => {
                    if (res.data.saved) {
                        this.resetTagCategoryModal()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Tag Category Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'tagCategoryModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.tagCategoryError = error.response.data.errors
                    }
                })
            },
            resetTagCategoryModal() {
                this.tagCategoryForm = {
                    title: null
                }
            },
            addTagType() {
                Vue.set(this.$data, 'tagTypeModal', true)
            },
            submitTagType(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/tag_types', this.tagTypeForm).then(res => {
                    if (res.data.saved) {
                        this.resetTagTypeModal()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Tag Type Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'tagTypeModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.tagTypeError = error.response.data.errors
                    }
                })

            },
            resetTagTypeModal() {
                this.tagCategoryForm = {
                    title: null
                }
            },
            cancelForm() {
                this.$emit('cancel');
            },
            addItem() {
                this.form.documents.push({
                    attachments: null,
                });
            },
            removeItem(index) {
                this.form.documents.splice(index, 1)
            },
        },
    }
</script>

<style scoped>
    .item-border-bottom{
        border-bottom: 1px solid black;
    }
</style>
