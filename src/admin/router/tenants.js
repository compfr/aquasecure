export default [
    {
        path: '/tenants',
        name: 'view-tenants',
        component: () => import('../views/Tenants/index'),
        meta: {
            pageTitle: 'Tenants',
            breadcrumb: [
                {
                    text: 'Tenants',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/tenants/create',
        name: 'create-tenants',
        component: () => import('../views/Tenants/form'),
        meta: {
            pageTitle: 'Tenants',
            breadcrumb: [
                {
                    text: 'Tenants Create',
                    active: true,
                },
            ],
        },
    },
    // {
    //     path: '/tenants/:id',
    //     name: 'show-tenants',
    //     component: () => import('../views/Tenants/show'),
    //     meta: {
    //         pageTitle: 'Tenants',
    //         breadcrumb: [
    //             {
    //                 text: 'Detail',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
    {
        path: '/tenants/:id/edit',
        name: 'edit-tenants',
        component: () => import('../views/Tenants/form'),
        meta: {
            mode: 'edit',
            pageTitle: 'Tenants',
            breadcrumb: [
                {
                    text: 'Tenants Edit',
                    active: true,
                },
            ],
        },
    },
]
