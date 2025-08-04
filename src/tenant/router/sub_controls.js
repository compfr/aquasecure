export default [
    {
        path: '/sub_controls',
        name: 'view-sub_controls',
        component: () => import('../views/SubControls/index'),
        meta: {
            pageTitle: 'Sub-Controls',
            breadcrumb: [
                {
                    text: 'Sub-Controls',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/sub_controls/create',
        name: 'create-sub_controls',
        component: () => import('../views/SubControls/form'),
        meta: {
            pageTitle: 'Sub-Controls',
            breadcrumb: [
                {
                    text: 'Sub-Controls Create',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/sub_controls/:id',
        name: 'show-sub_controls',
        component: () => import('../views/SubControls/show'),
        meta: {
            pageTitle: 'Sub-Controls',
            breadcrumb: [
                {
                    text: 'Detail',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/sub_controls/:id/edit',
        name: 'edit-sub_controls',
        component: () => import('../views/SubControls/form'),
        meta: {
            mode: 'edit',
            pageTitle: 'Sub-Controls',
            breadcrumb: [
                {
                    text: 'Sub-Controls Edit',
                    active: true,
                },
            ],
        },
    },
]
