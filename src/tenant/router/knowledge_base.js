export default [
    {
        path: '/knowledge-base',
        name: 'view-knowledge-base',
        component: () => import('../views/KnowledgeBase/index'),
        meta: {
            pageTitle: 'Knowledge Base',
            breadcrumb: [
                {
                    text: 'Billings',
                    active: true,
                },
            ],
        },
    },
]
