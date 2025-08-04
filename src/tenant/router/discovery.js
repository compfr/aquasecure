export default [
    {
        path: '/asm-discovery',
        name: 'view-asm-discovery',
        component: () => import('../views/Discovery/index'),
        meta: {
            pageTitle: 'Discovery',
            breadcrumb: [
                {
                    text: 'Discovery',
                    active: true,
                },
            ],
        },
    },

]
