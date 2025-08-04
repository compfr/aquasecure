export default [
    {
        path: '/billing',
        name: 'view-billing',
        component: () => import('../views/Billings/index'),
        meta: {
            pageTitle: 'Billings',
            breadcrumb: [
                {
                    text: 'Billings',
                    active: true,
                },
            ],
        },
    },
]
