export default [
    {
        path: '/getting-started',
        name: 'view-getting-started',
        component: () => import('../views/Projects/GettingStarted'),
        meta: {
            pageTitle: 'GRC',
            breadcrumb: [
                {
                    text: 'Getting Started',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/projects',
        name: 'view-projects',
        component: () => import('../views/Projects/index'),
        meta: {
            pageTitle: 'Projects',
            breadcrumb: [
                {
                    text: 'Projects',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/projects/create',
        name: 'create-projects',
        component: () => import('../views/Projects/form'),
        meta: {
            pageTitle: 'Projects',
            breadcrumb: [
                {
                    text: 'Projects Create',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/projects/:id',
        name: 'show-projects',
        component: () => import('../views/Projects/show'),
        meta: {
            pageTitle: 'Projects',
            breadcrumb: [
                {
                    text: 'Detail',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/projects/:id/edit',
        name: 'edit-projects',
        component: () => import('../views/Projects/form'),
        meta: {
            mode: 'edit',
            pageTitle: 'Projects',
            breadcrumb: [
                {
                    text: 'Projects Edit',
                    active: true,
                },
            ],
        },
    },
]
