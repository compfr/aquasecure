export default [
    {
        path: '/use-case-libraries',
        name: 'view-use-case-library',
        component: () => import('../views/UseCaseLibrary/index'),
        meta: {
            pageTitle: 'Use Case Libraries',
            breadcrumb: [
                {
                    text: 'Index',
                    active: true,
                },
            ],
        },
    },

    {
        path: '/security-overview',
        name: 'view-security-overview',
        component: () => import('../views/Dashboard/index'),
        meta: {
            pageTitle: 'Security Overview',
            breadcrumb: [
                {
                    text: 'Index',
                    active: true,
                },
            ],
        },
    },
    // {
    //     path: '/policies/create',
    //     name: 'create-policies',
    //     component: () => import('../views/Policies/form'),
    //     meta: {
    //         pageTitle: 'Policies',
    //         breadcrumb: [
    //             {
    //                 text: 'Policy Create',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
    // {
    //     path: '/policies/:id',
    //     name: 'show-policies',
    //     component: () => import('../views/Policies/show'),
    //     meta: {
    //         pageTitle: 'Policies',
    //         breadcrumb: [
    //             {
    //                 text: 'Detail',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
    // {
    //     path: '/policies/:id/edit',
    //     name: 'edit-policies',
    //     component: () => import('../views/Policies/form'),
    //     meta: {
    //         mode:'edit',
    //         pageTitle: 'Policies',
    //         breadcrumb: [
    //             {
    //                 text: 'Policy Edit',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
]
