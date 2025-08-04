export default [
    {
        path: '/asset-management',
        name: 'view-asset-management',
        component: () => import('../views/Assets/index'),
        meta: {
            pageTitle: 'Asset Management',
            breadcrumb: [
                {
                    text: 'Index',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/assets/:id/file_edit',
        name: 'edit-asset-data',
        component: () => import('../views/Assets/AssetFileEditing'),
        meta: {
            mode: 'edit',
            pageTitle: 'Asset',
            breadcrumb: [
                {
                    text: 'File Edit',
                    active: true,
                },
            ],
        },
    },
]
