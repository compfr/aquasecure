export default [
    {
        path: '/my-assignment',
        name: 'view-my-assignment',
        component: () => import('../views/MyAssignment/index'),
        meta: {
            pageTitle: 'My Assignment',
            breadcrumb: [
                {
                    text: 'My Assignment',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/assignments',
        name: 'view-assignment',
        component: () => import('../views/MyAssignment/fullIndex'),
        meta: {
            pageTitle: 'All Assignment',
            breadcrumb: [
                {
                    text: 'Index',
                    active: true,
                },
            ],
        },
    },
    // {
    //     path: '/open-case/create',
    //     name: 'create-open-case',
    //     component: () => import('../views/OpenCase/form'),
    //     meta: {
    //         pageTitle: 'Open Case',
    //         breadcrumb: [
    //             {
    //                 text: 'Open Case Create',
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
