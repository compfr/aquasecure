export default [
    {
        path: '/playbooks',
        name: 'view-playbooks',
        component: () => import('../views/Playbook/index'),
        meta: {
            pageTitle: 'Playbooks',
            breadcrumb: [
                {
                    text: 'Playbooks',
                    active: true,
                },
            ],
        },
    },
]
