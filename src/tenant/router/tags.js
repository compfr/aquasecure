export default [
    {
        path: '/tags',
        name: 'view-tags',
        component: () => import('../views/Tags/TagTabs'),
        meta: {
            pageTitle: 'Tags',
            breadcrumb: [
                {
                    text: 'Tags',
                    active: true,
                },
            ],
        },
    },
    // {
    //     path: '/tags/create',
    //     name: 'create-tags',
    //     component: () => import('../views/Tags/form'),
    //     meta: {
    //         pageTitle: 'Tags',
    //         breadcrumb: [
    //             {
    //                 text: 'Tags Create',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
    // {
    //     path: '/tags/:id',
    //     name: 'show-tags',
    //     component: () => import('../views/Tags/show'),
    //     meta: {
    //         pageTitle: 'Tags',
    //         breadcrumb: [
    //             {
    //                 text: 'Detail',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
    // {
    //     path: '/tags/:id/edit',
    //     name: 'edit-tags',
    //     component: () => import('../views/Tags/form'),
    //     meta: {
    //         mode:'edit',
    //         pageTitle: 'Tags',
    //         breadcrumb: [
    //             {
    //                 text: 'Tags Edit',
    //                 active: true,
    //             },
    //         ],
    //     },
    // },
]
