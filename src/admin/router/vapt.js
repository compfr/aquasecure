export default [
    {
        path: '/vapt',
        name: 'view-vapt',
        component: () => import('../views/VAPT/index'),
        meta: {
            pageTitle: 'VAPT',
            breadcrumb: [
                {
                    text: 'VAPT',
                    active: true,
                },
            ],
        },
    },
]
