export default [
    {
        path: '/frameworks',
        name: 'view-frameworks',
        component: () => import('../views/Frameworks/index'),
        meta: {
            pageTitle: 'Frameworks',
            breadcrumb: [
                {
                    text: 'Frameworks',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/frameworks/create',
        name: 'create-frameworks',
        component: () => import('../views/Frameworks/form'),
        meta: {
            pageTitle: 'Frameworks',
            breadcrumb: [
                {
                    text: 'Frameworks Create',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/frameworks/:id',
        name: 'show-frameworks',
        component: () => import('../views/Frameworks/show'),
        meta: {
            pageTitle: 'Frameworks',
            breadcrumb: [
                {
                    text: 'Detail',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/frameworks/:id/edit',
        name: 'edit-frameworks',
        component: () => import('../views/Frameworks/form'),
        meta: {
            mode: 'edit',
            pageTitle: 'Frameworks',
            breadcrumb: [
                {
                    text: 'Frameworks Edit',
                    active: true,
                },
            ],
        },
    },
]
