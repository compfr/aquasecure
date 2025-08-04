export default [
    {
        path: '/user-manual',
        name: 'view-user-manual',
        component: () => import('../views/UserManual/index'),
        meta: {
            pageTitle: 'User Manual',
            breadcrumb: [
                {
                    text: 'User Manual',
                    active: true,
                },
            ],
        },
    },
]
