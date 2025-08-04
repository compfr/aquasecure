export default [
    {
        path: '/api-integration',
        name: 'view-api-integration',
        component: () => import('../views/API/index'),
        meta: {
            pageTitle: 'API Integration',
            breadcrumb: [
                {
                    text: 'API Integration',
                    active: true,
                },
            ],
        },
    },

    {
        path: '/labels',
        name: 'view-labels',
        component: () => import('../views/Reports/Labels/index'),
        meta: {
            pageTitle: 'Labels',
            breadcrumb: [
                {
                    text: 'Labels',
                    active: true,
                },
            ],
        },
    },


    // {
    //     path: '/api-integration/create',
    //     name: 'create-api-integration',
    //     component: () => import('../views/API/form'),
    //     meta: {
    //         pageTitle: 'API',
    //         breadcrumb: [
    //             {
    //                 text: 'API Create',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
    // {
    //     path: '/api-integration/:id',
    //     name: 'show-api-integration',
    //     component: () => import('../views/API/show'),
    //     meta: {
    //         pageTitle: 'API',
    //         breadcrumb: [
    //             {
    //                 text: 'Detail',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
    // {
    //     path: '/api-integration/:id/edit',
    //     name: 'edit-api-integration',
    //     component: () => import('../views/API/form'),
    //     meta: {
    //         mode: 'edit',
    //         pageTitle: 'API',
    //         breadcrumb: [
    //             {
    //                 text: 'API Edit',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
]
