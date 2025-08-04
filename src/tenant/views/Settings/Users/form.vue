<template>
    <div v-if="show">
        <b-card :title="$route.meta.mode && $route.meta.mode === 'edit' ? 'Edit User' : 'Add New User'">
            <b-row>
                <b-col md="6">
                    <b-form-group
                        label="Name"
                        label-for="mc-name"
                    >
                        <b-form-input
                            id="mc-name"
                            placeholder="Name"
                            v-model="form.name"
                            :disabled="$route.meta.mode === 'edit'"
                        />
                        <error :error="error.name"/>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group
                        label="Email"
                        label-for="mc-email"
                    >
                        <b-form-input
                            id="mc-email"
                            :disabled="$route.meta.mode === 'edit'"
                            placeholder="Email"
                            v-model="form.email"
                        />
                        <error :error="error.email"/>
                    </b-form-group>
                </b-col>
                <b-col cols="6">
                    <b-form-group
                        label="Roles"
                    >
                        <x-tag-input :positionRelative="true" :removable="true" :multiple="true"
                                     :value="form.roles" keyIndex="id"
                                     :resource="`/api/get_roles`" column="title" name="name"
                                     @input="onRolesUpdate">
                        </x-tag-input>
                        <error :error="error.roles"/>
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
                        :to="{path:'/users'}"
                    >
                        Cancel
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {BCard, BCardText, BLink, BRow, BCol, BFormInput, BFormGroup, BFormCheckboxGroup,BButton} from 'bootstrap-vue'
    import {form} from "@/libs/mixins";
    import {get} from '@/libs/api'
    import Error from "@/components/Form/Error";
    import Ripple from "vue-ripple-directive";
    import XTagInput from "@/components/Form/TagInput";

    function initialize(to) {
        let urls = {
            'add': `/api/users/create`,
            'edit': `/api/users/${to.params.id}/edit`
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
            BButton
        },
        directives: {
            Ripple
        },
        data() {
            return {
                show: false,
                resource: '/users',
                store: '/api/users',
                method: 'POST',
                title: 'Add',
                message:'New User Added',
                permissions: [],
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
                    this.store = `/api/users/${this.$route.params.id}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Users has been updated';
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
            onRolesUpdate(e) {
                Vue.set(this.$data.form, 'roles', e)
            }
        },
    }
</script>

<style scoped>

</style>
