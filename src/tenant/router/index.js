import Vue from 'vue'
import VueRouter from 'vue-router'
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import controls from "@/tenant/router/controls";
import frameworks from "@/tenant/router/frameworks";
import policies from "@/tenant/router/policies";
import projects from "@/tenant/router/projects";
import assets from "@/tenant/router/assets";
import api from "@/tenant/router/api";
import domains from "@/tenant/router/domains";
import sub_controls from "@/tenant/router/sub_controls";
import evidences from "@/tenant/router/evidences";
import tags from "@/tenant/router/tags";
import reports from "@/tenant/router/reports";
import profile from "@/tenant/router/profile";
import my_assignment from "@/tenant/router/my_assignment";
import open_case from "@/tenant/router/open_case";
import use_case_libraries from "@/tenant/router/use_case_libraries";
import discovery from "@/tenant/router/discovery";
import vapt from "@/tenant/router/vapt";
import my_services from "@/tenant/router/my_services";
import investigations from "@/tenant/router/investigations";
import billings from "@/tenant/router/billings";
import risk_assessment from "@/tenant/router/risk_assessment";
import incident from "@/tenant/router/incident";
import playbooks from "@/tenant/router/playbooks";
import email_protection from "@/tenant/router/email_protection";
import inventory from "@/tenant/router/inventory";
import cmdb from "@/tenant/router/cmdb";
import training_catalog from "@/tenant/router/training_catalog";
import knowledge_base from "@/tenant/router/knowledge_base";
import user_manual from "@/tenant/router/user_manual";
import questionnaires from "@/tenant/router/questionnaires";

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: '/',
    scrollBehavior() {
        return {x: 0, y: 0}
    },
    routes: [
        {
            path: '/',
            name: 'view-home',
            component: () => import('../views/Home.vue'),
            meta: {
                pageTitle: 'Home',
                breadcrumb: [
                    {
                        text: 'Home',
                        active: true,
                    },
                ],
            },
        },
        {
            path: '/dashboard',
            name: 'view-home',
            component: () => import('../views/Home.vue'),
            meta: {
                pageTitle: 'Home',
                breadcrumb: [
                    {
                        text: 'Home',
                        active: true,
                    },
                ],
            },
        },
        {
            path: '/second-page',
            name: 'view-second-page',
            component: () => import('../views/SecondPage.vue'),
            meta: {
                pageTitle: 'Second Page',
                breadcrumb: [
                    {
                        text: 'Second Page',
                        active: true,
                    },
                ],
            },
        },
        ...controls,
        ...frameworks,
        ...policies,
        ...projects,
        ...assets,
        ...api,
        ...domains,
        ...reports,
        ...sub_controls,
        ...evidences,
        ...questionnaires,
        ...tags,
        ...profile,
        ...my_assignment,
        ...open_case,
        ...use_case_libraries,
        ...discovery,
        ...my_services,
        ...investigations,
        ...billings,
        ...vapt,
        ...risk_assessment,
        ...incident,
        ...playbooks,
        ...email_protection,
        ...inventory,
        ...cmdb,
        ...training_catalog,
        ...knowledge_base,
        ...user_manual,

        {
            path: '/mappings',
            name: 'view-mappings',
            component: () => import('../views/Mapping/index'),
            meta: {
                pageTitle: 'Mapping',
                breadcrumb: [
                    {
                        text: 'Mappings'
                    }
                ],
            },
        },
        {
            path: '/users',
            name: 'view-users',
            component: () => import('../views/Settings/Users/index'),
            meta: {
                pageTitle: 'Users',
                breadcrumb: [
                    {
                        text: 'Settings'
                    },
                    {
                        text: 'Users',
                        active: true,
                    },
                ],
            },
        },
        {
            path: '/users/create',
            name: 'create-users',
            component: () => import('../views/Settings/Users/form'),
            meta: {
                pageTitle: 'Users',
                breadcrumb: [
                    {
                        text: 'Settings'
                    },
                    {
                        text: 'Users Create',
                        active: true,
                    },
                ],
            },
        },
        {
            path: '/users/:id/edit',
            name: 'edit-users',
            component: () => import('../views/Settings/Users/form'),
            meta: {
                mode: 'edit',
                pageTitle: 'Users',
                breadcrumb: [
                    {
                        text: 'Settings'
                    },
                    {
                        text: 'Users Edit',
                        active: true,
                    },
                ],
            },
        },
        {
            path: '/account-activation',
            name: 'view-account-activation',
            component: () => import('../views/Settings/Users/UserActivation'),
            meta: {
                pageTitle: 'User Activation',
                breadcrumb: [
                    {
                        text: 'User Activation',
                        active: true,
                    },
                ],
            },
        },
        {
            path: '/roles',
            name: 'view-roles',
            component: () => import('../views/Settings/Roles/index'),
            meta: {
                pageTitle: 'Roles',
                breadcrumb: [
                    {
                        text: 'Settings'
                    },
                    {
                        text: 'Roles',
                        active: true,
                    },
                ],
            },
        },
        {
            path: '/roles/create',
            name: 'create-roles',
            component: () => import('../views/Settings/Roles/form'),
            meta: {
                pageTitle: 'Roles',
                breadcrumb: [
                    {
                        text: 'Settings'
                    },
                    {
                        text: 'Roles',
                    },
                    {
                        text: 'Create',
                        active: true,
                    },
                ],
            },
        },
        {
            path: '/roles/:id/edit',
            name: 'edit-roles',
            component: () => import('../views/Settings/Roles/form'),
            meta: {
                mode: 'edit',
                pageTitle: 'Roles',
                breadcrumb: [
                    {
                        text: 'Settings'
                    },
                    {
                        text: 'Roles',
                        link: '/roles'
                    },
                    {
                        text: 'Roles Edit',
                        active: true,
                    },
                ],
            },
        },
        {
            path: '/general-setting',
            name: 'view-general-setting',
            component: () => import('../views/Settings/general-setting'),
            meta: {
                pageTitle: 'General Setting',
                breadcrumb: [
                    {
                        text: 'Settings'
                    },
                    {
                        text: 'General',
                        active: true,
                    },
                ],
            },
        },
        {
            path: '/error-404',
            name: 'error-404',
            component: () => import('../../views/error/Error404.vue'),
            meta: {
                layout: 'full',
            },
        },
        {
            path: '*',
            redirect: 'error-404',
        },
    ],
})

router.beforeEach((to, from, next) => {
    setTimeout(() => {
        if (to.name == 'error-404' || to.name == 'not-authorized' || to.name == 'view-home') {
            next()
        } else {
            let bool = false
            var permissions = window.apex.user.permissions;
            permissions.forEach(function (entry) {
                if (to.name === entry.name) {
                    bool = true
                }
            })
            if (bool) {
                next()
            } else {
                if (from.name === null) {
                    next({name: 'not-authorized'})
                } else {
                    Vue.$toast({
                        component: ToastificationContent,
                        props: {
                            title: 'Un-Authorized',
                            icon: 'BellIcon',
                            text: 'You Are Not Authorized',
                            variant: 'danger'
                        },
                    })
                }
            }
        }
    }, 10)
})
// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
    // Remove initial loading
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = 'none'
    }
})

export default router
