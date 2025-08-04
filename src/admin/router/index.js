import Vue from 'vue'
import VueRouter from 'vue-router'
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import controls from "@/admin/router/controls";
import frameworks from "@/admin/router/frameworks";
import policies from "@/admin/router/policies";
import tenants from "@/admin/router/tenants";
import domains from "@/admin/router/domains";
import sub_controls from "@/admin/router/sub_controls";
import evidences from "@/admin/router/evidences";
import questionnaires from "@/admin/router/questionnaires";
import tags from "@/admin/router/tags";
import api from "@/admin/router/api";
import reports from "@/admin/router/reports";
import profile from "@/admin/router/profile";
import use_case_libraries from "@/admin/router/use_case_libraries";
import discovery from "@/admin/router/discovery";
import open_case from "@/admin/router/open_case";
import my_assignment from "@/admin/router/my_assignment";
import tenant_requests from "@/admin/router/tenant_requests";
import assets from "@/admin/router/assets";
import projects from "@/admin/router/projects";
import my_services from "@/admin/router/my_services";
import vapt from "@/admin/router/vapt";
import risk_assessment from "@/admin/router/risk_assessment";
import investigations from "@/admin/router/investigations";
import billings from "@/admin/router/billings";
import incident from "@/admin/router/incident";
import inventory from "@/admin/router/inventory";
import cmdb from "@/admin/router/cmdb";
import playbooks from "@/admin/router/playbooks";
import email_protection from "@/admin/router/email_protection";
import training_catalog from "@/admin/router/training_catalog";
import knowledge_base from "@/admin/router/knowledge_base";
import user_manual from "@/admin/router/user_manual";

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: '/',
    scrollBehavior() {
        return {x: 0, y: 0}
    },
    routes: [
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
        // ...controls,
        ...frameworks,
        ...policies,
        ...tenants,
        // ...domains,
        // ...sub_controls,
        ...evidences,
        ...questionnaires,
        ...tags,
        ...api,
        ...reports,
        ...profile,
        ...use_case_libraries,
        ...discovery,
        ...open_case,
        ...my_assignment,
        ...tenant_requests,
        ...assets,
        ...projects,
        ...my_services,
        ...vapt,
        ...risk_assessment,
        ...investigations,
        ...billings,
        ...incident,
        ...inventory,
        ...cmdb,
        ...playbooks,
        ...email_protection,
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
            path: '/not-authorized',
            name: 'not-authorized',
            component: () => import('../../views/error/NotAuthorized.vue'),
            meta: {
                layout: 'full',
            },
        },
        {
            path: '*',
            redirect: 'error-404',
        },
        {
            path: '/tenant-users',
            name: 'view-tenant-users',
            component: () => import('../views/Settings/Users/TenantUser'),
            meta: {
                pageTitle: 'Tenant Users',
                breadcrumb: [
                    {
                        text: 'User Management'
                    },
                    {
                        text: 'Tenant Users',
                        active: true,
                    },
                ],
            },
        },
    ],
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

export default router
