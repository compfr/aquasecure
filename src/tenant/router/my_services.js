export default [
    {
        path: '/my-services',
        name: 'view-my-services',
        component: () => import('../views/MyServices/index'),
        meta: {
            pageTitle: 'My Services',
            breadcrumb: [
                {
                    text: 'My Services',
                    active: true,
                },
            ],
        },
    },
]
