<template>
    <div v-if="show">
        <b-card :title="'Edit Profile'">
            <b-row>
                <b-col md="6">
                    <b-form-group label="Name">
                        <b-form-input placeholder="Name" v-model="form.name"/>
                        <error :error="error.name"/>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group label="Email">
                        <b-form-input placeholder="Email" v-model="form.email" readonly/>
                        <error :error="error.email"/>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col>
                    <b-form-checkbox v-model="showPassword" switch>
                        Change Password
                    </b-form-checkbox>
                </b-col>
            </b-row>
            <b-row v-if="showPassword">
                <b-col md="4">
                    <b-form-group label="Current Password">
                        <b-form-input type="password" placeholder="Current Password" v-model="form.current_password"/>
                        <error :error="error.current_password"/>
                    </b-form-group>
                </b-col>
                <b-col md="4">
                    <b-form-group label="New Password">
                        <b-form-input type="password" placeholder="New Password" v-model="form.password"/>
                        <error :error="error.password"/>
                    </b-form-group>
                </b-col>
                <b-col md="4">
                    <b-form-group label="Confirm Password">
                        <b-form-input type="password" placeholder="Confirm Password"
                                      v-model="form.password_confirmation"/>
                        <error :error="error.password_confirmation"/>
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
                        :to="{path:'/tenants'}"
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
import {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BFormGroup,
    BButton,
    BFormCheckbox,
} from 'bootstrap-vue'
import {form} from "@/libs/mixins";
import {get} from '@/libs/api';
import Error from "@/components/Form/Error";
import Ripple from "vue-ripple-directive";

function initialize(to) {
    let urls = {
        'add': `/api/profile`,
    };
    return (urls[to.meta.mode] || urls['add'])
}

export default {
    mixins: [form],
    components: {
        Error,
        BCard,
        BRow,
        BCol,
        BFormInput,
        BFormGroup,
        BButton,
        BFormCheckbox,
    },
    directives: {
        Ripple
    },
    data() {
        return {
            showPassword: false,
            show: false,
            resource: '/profile',
            store: '/api/profile',
            method: 'POST',
            title: 'Add',
            message: 'Profile Updated',
            form: {
                name: '',
                email: '',
                current_password: '',
                password: '',
                password_confirmation: ''
            }
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
            Vue.set(this.$data, 'form', res.data.user);
            this.show = true;
        },
        formSubmitted() {
            this.submit(this.form, (res) => {
                this.success();
                window.reload();
                // this.successfull(res);
            })
        },
        successfull(res) {
            this.$router.push(`${this.resource}`);
        }
    }
}
</script>

<style scoped>
</style>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
