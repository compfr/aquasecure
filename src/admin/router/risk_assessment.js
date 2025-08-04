export default [
    {
        path: '/risk-assessment',
        name: 'view-risk-assessment',
        component: () => import('../views/RiskAssessment/index'),
        meta: {
            pageTitle: 'Risk Assessment',
            breadcrumb: [
                {
                    text: 'Risk Assessment',
                    active: true,
                },
            ],
        },
    },
]
