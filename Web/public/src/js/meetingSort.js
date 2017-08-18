"use strict";
wf.define('meetingSort', [], function () {

    return function () {
        var format = function (str) {
            if (str.substring(0, 1) > 1) {
                str = '0' + str;
            }
            return str;
        }
        return {
            sort: function (currentData, prevData) {
                currentData.startTime = format(currentData.startTime);
                prevData.startTime = format(prevData.startTime);
                if (currentData.startTime <= prevData.startTime) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    };
})