export default [
    {
        path: '/controls',
        name: 'view-controls',
        component: () => import('../views/Controls/index'),
        meta: {
            pageTitle: 'Controls',
            breadcrumb: [
                {
                    text: 'Controls',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/controls/create',
        name: 'create-controls',
        component: () => import('../views/Controls/form'),
        meta: {
            pageTitle: 'Controls',
            breadcrumb: [
                {
                    text: 'Controls Create',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/controls/:id',
        name: 'show-controls',
        component: () => import('../views/Controls/show'),
        meta: {
            pageTitle: 'Controls',
            breadcrumb: [
                {
                    text: 'Detail',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/controls/:id/edit',
        name: 'edit-controls',
        component: () => import('../views/Controls/form'),
        meta: {
            mode: 'edit',
            pageTitle: 'Controls',
            breadcrumb: [
                {
                    text: 'Controls Edit',
                    active: true,
                },
            ],
        },
    },
]
