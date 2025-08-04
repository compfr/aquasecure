export default [
    {
        path: '/evidences',
        name: 'view-evidences',
        component: () => import('../views/Evidences/index'),
        meta: {
            pageTitle: 'Evidences',
            breadcrumb: [
                {
                    text: 'Evidences',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/evidences/create',
        name: 'create-evidences',
        component: () => import('../views/Evidences/form'),
        meta: {
            pageTitle: 'Evidences',
            breadcrumb: [
                {
                    text: 'Evidences Create',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/evidences/:id',
        name: 'show-evidences',
        component: () => import('../views/Evidences/show'),
        meta: {
            pageTitle: 'Evidences',
            breadcrumb: [
                {
                    text: 'Detail',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/evidences/:id/edit',
        name: 'edit-evidences',
        component: () => import('../views/Evidences/form'),
        meta: {
            mode: 'edit',
            pageTitle: 'Evidences',
            breadcrumb: [
                {
                    text: 'Evidences Edit',
                    active: true,
                },
            ],
        },
    },
]
