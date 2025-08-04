export default [
    {
        path: '/cmdb',
        name: 'view-cmdb',
        component: () => import('../views/CMDB/index'),
        meta: {
            pageTitle: 'CMDB',
            breadcrumb: [
                {
                    text: 'CMDB',
                    active: true,
                },
            ],
        },
    },
]
