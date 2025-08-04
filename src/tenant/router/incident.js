export default [
    {
        path: '/incident-management',
        name: 'view-incident-management',
        component: () => import('../views/Incident/index'),
        meta: {
            pageTitle: 'Incident Management',
            breadcrumb: [
                {
                    text: 'Incident Management',
                    active: true,
                },
            ],
        },
    },
]
