export default [
    {
        path: '/inventory',
        name: 'view-inventory',
        component: () => import('../views/Inventory/index'),
        meta: {
            pageTitle: 'Inventory',
            breadcrumb: [
                {
                    text: 'Inventory',
                    active: true,
                },
            ],
        },
    },
]
