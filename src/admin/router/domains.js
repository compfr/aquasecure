export default [
    {
        path: '/domains',
        name: 'view-domains',
        component: () => import('../views/Domains/index'),
        meta: {
            pageTitle: 'Domains',
            breadcrumb: [
                {
                    text: 'Domains',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/domains/create',
        name: 'create-domains',
        component: () => import('../views/Domains/form'),
        meta: {
            pageTitle: 'Domains',
            breadcrumb: [
                {
                    text: 'Domains Create',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/domains/:id',
        name: 'show-domains',
        component: () => import('../views/Domains/show'),
        meta: {
            pageTitle: 'Domains',
            breadcrumb: [
                {
                    text: 'Detail',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/domains/:id/edit',
        name: 'edit-domains',
        component: () => import('../views/Domains/form'),
        meta: {
            mode: 'edit',
            pageTitle: 'Domains',
            breadcrumb: [
                {
                    text: 'Domains Edit',
                    active: true,
                },
            ],
        },
    },
]
