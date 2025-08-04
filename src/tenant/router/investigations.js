export default [
    {
        path: '/investigations',
        name: 'view-investigations',
        component: () => import('../views/Investigation/index'),
        meta: {
            pageTitle: 'Investigations',
            breadcrumb: [
                {
                    text: 'Investigations',
                    active: true,
                },
            ],
        },
    },
]
