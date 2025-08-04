export default [
    {
        path: '/questionnaires',
        name: 'view-questionnaires',
        component: () => import('../views/Questionnaires/index'),
        meta: {
            pageTitle: 'Questionnaires',
            breadcrumb: [
                {
                    text: 'Questionnaires',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/questionnaires/create',
        name: 'create-questionnaires',
        component: () => import('../views/Questionnaires/form'),
        meta: {
            pageTitle: 'Questionnaires',
            breadcrumb: [
                {
                    text: 'Questionnaires Create',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/questionnaires/:id',
        name: 'show-questionnaires',
        component: () => import('../views/Questionnaires/show'),
        meta: {
            pageTitle: 'Questionnaires',
            breadcrumb: [
                {
                    text: 'Detail',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/questionnaires/:id/edit',
        name: 'edit-questionnaires',
        component: () => import('../views/Questionnaires/form'),
        meta: {
            mode: 'edit',
            pageTitle: 'Questionnaires',
            breadcrumb: [
                {
                    text: 'Questionnaires Edit',
                    active: true,
                },
            ],
        },
    },
]
