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
                    label="Description"
                >
                    <b-form-input
                        placeholder="Description"
                        v-model="form.desc"
                    />
                    <error :error="error.desc"/>
                </b-form-group>
            </b-col>

            <b-col md="12">
                <b-form-group
                    label="Search Query"
                >
                    <b-form-input
                        placeholder="Search"
                        v-model="form.search_query"
                    />
                    <error :error="error.search_query"/>
                </b-form-group>
            </b-col>
            <b-col cols="6">
                <b-form-group label="Time">
                    <b-form-select v-model="form.earliest_time" :options="timeOptions"/>
                    <error :error="error.earliest_time"/>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                    label="Label"
                >
                    <x-tag-input :value="form.label" :resource="`/api/search/labels`"
                                 column="name" name="name" @input="onLabelUpdate"/>
                    <error :error="error.label_id"/>
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
                    @click="cancelForm"
                >
                    Cancel
                </b-button>
            </b-col>
        </b-row>
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

    export default {
        name: "FormReport",
        props: {
            formType: String,
            formId: Number
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
                store: '/api/reports',
                method: 'POST',
                title: 'Add',
                message: 'New Report Added',
                timeOptions: [
                    {
                        text:"15 minutes",
                        value:"-15m"
                    },
                    {
                        text:"60 minutes",
                        value:"-60m"
                    },
                    {
                        text:"2 hours",
                        value:"-2h"
                    },
                ],
            }
        },
        created() {

            let urls = {
                'Add': `/api/reports/create`,
                'Edit': `/api/reports/${this.formId}/edit`
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
                    this.store = `/api/reports/${this.formId}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Report has been updated';
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
            onLabelUpdate(e){
                Vue.set(this.$data.form, 'label', e);
                Vue.set(this.$data.form, 'label_id', e.id);
            },
            successfull(res) {
                this.$router.push(`${this.resource}`)
            },
            cancelForm(){
                this.$emit('cancel');
            }
        },
    }
</script>

<style scoped>

</style>
