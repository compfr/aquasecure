export default [
    {
        path: '/training-catalog',
        name: 'view-training-catalog',
        component: () => import('../views/TrainingCatalog/index'),
        meta: {
            pageTitle: 'Training Catalog',
            breadcrumb: [
                {
                    text: 'Training Catalog',
                    active: true,
                },
            ],
        },
    },
]
