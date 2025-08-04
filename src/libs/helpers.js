export function copyObject(obj) {
    const copy = Object.assign({}, obj);
    return copy
}

export function objectToFormData(obj, form, namespace) {
    let fd = form || new FormData();

    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {

            let formKey = namespace ?
                namespace + '[' + property + ']' :
                property;

            if (obj[property] === Object(obj[property]) && !(obj[property] instanceof File)) {
                objectToFormData(obj[property], fd, formKey);
            } else if (obj[property] instanceof Array) {
                for (var i = 0; i < obj[property].length; i++) {
                    objectToFormData(obj[property][i], fd, `${formKey}[${i}]`);
                }
            } else {
                const value = obj[property] === null ? '' : obj[property]
                fd.append(formKey, value);
            }
        }
    }
    return fd
}

export function formatMoney(value) {
    let val = (value / 1).toFixed(2).replace(",", ".");
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function isAllowed(permission) {
    var permissions = window.apex.user.permissions;
    var bool = false
    permissions.forEach(function (entry) {
        if (permission === entry.name) {
            bool = true
        }
    })
    return bool
}

export function hasGuardRole(role) {
    var roles = window.apex.user.roles;
    var bool = false
    roles.forEach(function (entry) {
        if (role === entry) {
            bool = true
        }
    })
    return bool
}



