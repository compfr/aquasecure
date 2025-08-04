export default [
    {
        path: '/profile',
        name: 'view-profile',
        component: () => import('../views/Profile/form'),
        meta: {
            pageTitle: 'Profile',
            breadcrumb: [
                {
                    text: 'Profile',
                    active: true,
                },
            ],
        },
    },


    // {
    //     path: '/profile/create',
    //     name: 'create-profile',
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
    //     path: '/profile/:id',
    //     name: 'show-profile',
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
    //     path: '/profile/:id/edit',
    //     name: 'edit-profile',
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
