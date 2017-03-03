"use strict";
wf.define('meetingCheck', [], function () {

    return function () {
        return {
            check: function (currentData, prevData) {
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