<template>
    <div v-if="show">
        <b-card :title="$route.meta.mode && $route.meta.mode === 'edit' ? 'Edit Tag' : 'Add New Tag'">
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
                    <div class="position-top-0 position-right-0 position-absolute px-1" @click="addTagType">
                        <small>Add New</small>
                    </div>
                    <b-form-group
                        label="Tag Type"
                    >
                        <x-tag-input :value="form.tag_type" :resource="`/api/search/tag_type`" column="title"
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
                <b-col cols="12">
                    <!--                                    <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewSubControl">-->
                    <!--                                        <small>Add New</small>-->
                    <!--                                    </div>-->
                    <b-form-group
                        label="Sub Controls"
                    >
                        <x-tag-input :positionRelative="true" :removable="true"
                                     keyIndex="control_sub_control_id"
                                     :addition-indexs="['framework_id']"
                                     :multiple="true" :value="form.sub_controls" relation="sub_control"
                                     :resource="`/api/search/control_sub_controls`" column="title"
                                     name="title"
                                     @input="onSubControlsUpdate">
                        </x-tag-input>
                    </b-form-group>
                </b-col>
                <b-col cols="12">
                    <!--                                    <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewSubControl">-->
                    <!--                                        <small>Add New</small>-->
                    <!--                                    </div>-->
                    <b-form-group
                        label="Controls"
                    >
                        <x-tag-input :positionRelative="true" :removable="true"
                                     keyIndex="domain_control_id"
                                     :addition-indexs="['framework_id']"
                                     :multiple="true" :value="form.controls" relation="control"
                                     :resource="`/api/search/domain_controls`" column="title" name="title"
                                     @input="onControlsUpdate">
                        </x-tag-input>
                    </b-form-group>
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
                        :to="{path:'/tags'}"
                    >
                        Cancel
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
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
        BCard,
        BCardText,
        BLink,
        BRow,
        BCol,
        BFormInput,
        BFormGroup,
        BFormCheckboxGroup,
        BButton,
        BFormTextarea,
        BFormSelect, BModal, VBModal
    } from 'bootstrap-vue'
    import {form} from "@/libs/mixins";
    import {get, post} from '@/libs/api'
    import Error from "@/components/Form/Error";
    import Ripple from "vue-ripple-directive";
    import flatPickr from 'vue-flatpickr-component';
    import XTagInput from "@/components/Form/TagInput";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";

    function initialize(to) {
        let urls = {
            'add': `/api/tags/create`,
            'edit': `/api/tags/${to.params.id}/edit`
        };
        return (urls[to.meta.mode] || urls['add'])
    }

    export default {
        mixins: [form],
        components: {
            XTagInput,
            Error,
            BCard,
            BCardText,
            BLink,
            BRow,
            BCol,
            BFormInput,
            BFormGroup,
            BFormCheckboxGroup,
            BButton,
            BFormTextarea,
            BFormSelect,
            flatPickr,
            BModal, VBModal
        },
        directives: {
            Ripple, VBModal
        },
        data() {
            return {
                show: false,
                resource: '/tags',
                store: '/api/tags',
                method: 'POST',
                title: 'Add',
                message: 'New Tag Added',
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

        beforeRouteEnter(to, from, next) {
            get(initialize(to))
                .then((res) => {
                    next(vm => vm.setData(res))
                })
        },
        beforeRouteUpdate(to, from, next) {
            get(initialize(to))
                .then((res) => {
                    this.setData(res);
                    next()
                })
        },
        methods: {
            setData(res) {
                Vue.set(this.$data, 'form', res.data.form);

                if (this.$route.meta.mode === 'edit') {
                    this.store = `/api/tags/${this.$route.params.id}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Tags has been updated';
                }
                this.show = true
            },
            formSubmitted() {
                this.submit(this.form, (res) => {
                    this.success()
                    this.successfull(res)
                })
            },
            successfull(res) {
                this.$router.push(`${this.resource}`)
            },
            onSubControlsUpdate(e) {
                Vue.set(this.$data.form, 'sub_controls', e);
            },
            onControlsUpdate(e) {
                Vue.set(this.$data.form, 'controls', e);
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
                                text: 'Framework Type Added',
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
                                text: 'Framework Type Added',
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
        },
    }
</script>

<style scoped>

</style>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
