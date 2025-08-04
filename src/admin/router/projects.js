export default [
    {
        path: '/projects',
        name: 'view-projects',
        component: () => import('../views/Projects/index'),
        meta: {
            pageTitle: 'Tenant Project',
            breadcrumb: [
                {
                    text: 'Tenant Project',
                    active: true,
                },
            ],
        },
    },
]
