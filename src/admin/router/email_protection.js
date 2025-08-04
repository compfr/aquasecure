export default [
    {
        path: '/email-protection',
        name: 'view-email-protection',
        component: () => import('../views/EmailProtection/index'),
        meta: {
            pageTitle: 'Email Protection',
            breadcrumb: [
                {
                    text: 'Email Protection',
                    active: true,
                },
            ],
        },
    },
]
