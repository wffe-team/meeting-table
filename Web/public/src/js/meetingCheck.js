"use strict";
wf.define('meetingCheck', [], function () {

    return function () {
        var format = function (str) {
            if (str.substring(0, 1) > 1) {
                str = '0' + str;
            }
            return str;
        }
        return {
            check: function (currentData, prevData) {
                currentData.startTime = format(currentData.startTime);
                currentData.endTime = format(currentData.endTime);
                prevData.startTime = format(prevData.startTime);
                prevData.endTime = format(prevData.endTime);
                if (currentData.endTime <= currentData.startTime) {
                    return false;
                }
                if (currentData.date == prevData.date && currentData.tableRoom == prevData.tableRoom) {
                    if (currentData.startTime >= prevData.endTime || currentData.endTime <= prevData.startTime) {
                        return false;
                    }
                }
                return true;
            }
        }
    };
})