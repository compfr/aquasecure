export default [
    {
        path: '/tenant-requests',
        name: 'view-tenant-requests',
        component: () => import('../views/TenantRequest/index'),
        meta: {
            pageTitle: 'Tenant Requests',
            breadcrumb: [
                {
                    text: 'Tenant Requests',
                    active: true,
                },
            ],
        },
    },
    // {
    //     path: '/tenants/create',
    //     name: 'create-tenants',
    //     component: () => import('../views/Tenants/form'),
    //     meta: {
    //         pageTitle: 'Tenants',
    //         breadcrumb: [
    //             {
    //                 text: 'Tenants Create',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
    // {
    //     path: '/tenant-requests/:id',
    //     name: 'show-tenant-requests',
    //     component: () => import('../views/TenantRequest/show'),
    //     meta: {
    //         pageTitle: 'Tenant Requests',
    //         breadcrumb: [
    //             {
    //                 text: 'Detail',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
    // {
    //     path: '/tenants/:id/edit',
    //     name: 'edit-tenants',
    //     component: () => import('../views/Tenants/form'),
    //     meta: {
    //         mode: 'edit',
    //         pageTitle: 'Tenants',
    //         breadcrumb: [
    //             {
    //                 text: 'Tenants Edit',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
]
