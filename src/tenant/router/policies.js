export default [
    {
        path: '/policies',
        name: 'view-policies',
        component: () => import('../views/Policies/index'),
        meta: {
            pageTitle: 'Policies',
            breadcrumb: [
                {
                    text: 'Policies',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/policies/create',
        name: 'create-policies',
        component: () => import('../views/Policies/form'),
        meta: {
            pageTitle: 'Policies',
            breadcrumb: [
                {
                    text: 'Policy Create',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/policies/:id',
        name: 'show-policies',
        component: () => import('../views/Policies/show'),
        meta: {
            pageTitle: 'Policies',
            breadcrumb: [
                {
                    text: 'Detail',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/policies/:id/edit',
        name: 'edit-policies',
        component: () => import('../views/Policies/form'),
        meta: {
            mode:'edit',
            pageTitle: 'Policies',
            breadcrumb: [
                {
                    text: 'Policy Edit',
                    active: true,
                },
            ],
        },
    },
]
