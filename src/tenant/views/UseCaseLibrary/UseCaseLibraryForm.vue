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
            <b-col cols="6">
                <div class="position-top-0 position-right-0 position-absolute px-1" @click="addCategory">
                    <small>Add New</small>
                </div>
                <b-form-group
                    label="Category"
                >
                    <x-tag-input :value="form.category" :resource="`/api/search/use_case_library_categories`"
                                 column="title" name="title"
                                 @input="onCategoryUpdate">
                    </x-tag-input>
                    <error :error="error.category_id"/>
                </b-form-group>
            </b-col>
            <b-col cols="12">
                <b-form-group
                    label="Description"
                >
                    <b-form-textarea v-model="form.description" rows="4"/>
                    <error :error="error.description"/>
                </b-form-group>
            </b-col>
            <b-col cols="6">
                <b-form-group
                    label="Narratives"
                >
                    <b-form-textarea v-model="form.narratives" rows="4"/>
                    <error :error="error.narratives"/>
                </b-form-group>
            </b-col>
            <b-col cols="6">
                <b-form-group
                    label="References"
                >
                    <b-form-textarea v-model="form.references" rows="4"/>
                    <error :error="error.references"/>
                </b-form-group>
            </b-col>
            <b-col cols="12" class="d-flex justify-content-between align-items-center">
                <h3>Queries</h3>
                <b-button @click="addItem" variant="primary">
                    <feather-icon icon="PlusIcon" size="14"/>
                    Add
                </b-button>
            </b-col>
            <hr/>
            <b-col cols="12">
                <template v-for="(item,index) in form.queries">
                    <b-row class="align-items-center">
                        <b-col cols="6">
                            <b-form-group
                                label="Query"
                            >
                                <b-form-textarea v-model="item.query" rows="2"/>
                                <error :error="error[`queries.${index}.query`]"/>
                            </b-form-group>
                        </b-col>
                        <b-col cols="5">
                            <b-form-group
                                label="Api Type"
                            >
                                <x-tag-input :value="item.api_type" :resource="`/api/search/api_types`"
                                             column="title" name="title"
                                             @input="onApiTypeUpdate($event, index)">
                                </x-tag-input>
                                <error :error="error[`queries.${index}.api_type_id`]"/>
                            </b-form-group>
                        </b-col>
                        <b-col cols="1" v-if="form.queries.length > 1">
                            <b-button @click="removeItem(index)" variant="primary">
                                <feather-icon icon="TrashIcon" size="14"/>
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
            v-model="categoryModal"
            id="modal-category"
            title="Add New Tag Category"
            ok-title="Submit"
            cancel-variant="outline-secondary"
            @hidden="resetCategoryModal"
            @ok="submitCategory">

            <b-form-group
                label="Title"
            >
                <b-form-input
                    placeholder="Title"
                    v-model="categoryForm.title"
                />
                <error :error="categoryError.title"/>
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
        BFormSelect
    } from 'bootstrap-vue'
    import {form} from "@/libs/mixins";
    import {get, post} from '@/libs/api'
    import Error from "@/components/Form/Error";
    import Ripple from "vue-ripple-directive";
    import flatPickr from 'vue-flatpickr-component';
    import XTagInput from "@/components/Form/TagInput";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";

    export default {
        name: "UseCaseLibraryForm",
        props: {
            formType: String,
            formId: String
        },
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
            flatPickr
        },
        directives: {
            Ripple
        },
        data() {
            return {
                show: false,
                resource: '/use-case-libraries',
                store: '/api/use_case_libraries',
                method: 'POST',
                title: 'Add',
                message: 'New Use Case Added',
                categoryModal: false,
                categoryForm: {
                    title: null
                },
                categoryError: {},
            }
        },

        created() {

            let urls = {
                'Add': `/api/use_case_libraries/create`,
                'Edit': `/api/use_case_libraries/${this.formId}/edit`
            };
            const url = urls[this.formType];

            console.log(this.formType);

            get(url).then((res) => {
                this.setData(res);
            })
        },


        methods: {
            setData(res) {
                Vue.set(this.$data, 'form', res.data.form);

                if (this.formType === 'Edit') {
                    this.store = `/api/use_case_libraries/${this.formId}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Use Case has been updated';
                }
                this.show = true
            },
            formSubmitted() {
                this.submit(this.form, (res) => {
                    this.success()
                    this.$emit('close');
                    // this.successfull(res)
                })
            },
            addCategory() {
                Vue.set(this.$data, 'categoryModal', true)
            },
            submitCategory(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/use_case_library_categories', this.categoryForm).then(res => {
                    if (res.data.saved) {
                        this.resetCategoryModal()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Use Case Category Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'categoryModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.categoryError = error.response.data.errors
                    }
                })

            },
            resetCategoryModal() {
                this.categoryForm = {
                    title: null
                }
            },
            onCategoryUpdate(e) {
                Vue.set(this.$data.form, 'category', e);
                Vue.set(this.$data.form, 'category_id', e.id);
            },
            goBack() {
                this.$router.go(-1);
            },
            cancelForm() {
                this.$emit('cancel');
            },
            addItem() {
                this.form.queries.push({
                    query: '',
                    api_type_id: null,
                    ap_type: null
                });
            },
            removeItem(index){
                this.form.queries.splice(index, 1)
            },
            onApiTypeUpdate(e, index){
                for(var i=0;i < this.form.queries.length;i++){
                    if(this.form.queries[i].api_type_id == e.id){
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Error',
                                icon: 'BellIcon',
                                text: 'Api Type Already Selected',
                                variant: 'danger'
                            },
                        })
                        return 0;
                    }
                }

                Vue.set(this.$data.form.queries[index],'api_type', e)
                Vue.set(this.$data.form.queries[index],'api_type_id', e.id)
            }

        },
    }
</script>

<style scoped>

</style>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
