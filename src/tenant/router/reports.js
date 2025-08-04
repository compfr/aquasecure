export default [
    {
        path: '/search-data',
        name: 'view-search-data',
        component: () => import('../views/Reports/SearchData'),
        meta: {
            pageTitle: 'Search Data',
            breadcrumb: [
                {
                    text: 'Search',
                    active: true,
                },
            ],
        },
    },

    {
        path: '/list-labels',
        name: 'view-list-labels',
        component: () => import('../views/Reports/Labels/index'),
        meta: {
            pageTitle: 'Labels',
            breadcrumb: [
                {
                    text: 'List',
                    active: true,
                },
            ],
        },
    },

    {
        path: '/list-reports',
        name: 'view-list-reports',
        component: () => import('../views/Reports/Report/index'),
        meta: {
            pageTitle: 'Reports',
            breadcrumb: [
                {
                    text: 'List',
                    active: true,
                },
            ],
        },
    }

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
