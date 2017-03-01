"use strict";

wf.define('meeting', [], function () {
    return (_=> {
        var sender = (url, data, callback) => {
            $.post(url, data, (rsp) => {
                if ($.isFunction(callback)) {
                    callback(rsp);
                }
            });
        };
        return {
            save: (meeting, callback) => {
                sender('meeting/save', meeting, callback);
            },
            //避免关键字delete
            remove: (id, callback) => {
                sender('meeting/delete', { id: id }, callback);
            }
        };
    })();
});