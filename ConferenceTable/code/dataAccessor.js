var express = require('express');
var fs = require('fs');
var Conference = require('../model/Conference');
var ConferenceTable = require('../model/ConferenceTable');

var file = 'conferenceData.txt';

module.exports = {

    /// <param name="dateArr" type="Array">日期数组</param>
    get: (dateArr) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                console.log('读取文件' + file + '出错');
                throw err;
            }
            if (!data) {
                return null;
            }
            let arr = JSON.parse('[' + data + ']');
            if (dateArr) {
                var result = [];
                dateArr.forEach((value) => {
                    result.push({ date: value, conferences: [] });
                });
                arr.forEach((conference) => {
                    if (dateArr.findIndex(conference.date) > -1) {
                        result[conference.id].push(conference);
                    }
                });
                return result;
            }
            return arr;
        });
    },

    /// <param name="conferenceArray" type="Array">会议列表</param>
    set: (conferenceArray) => {
        fs.writeFile(file, data, (err) => {
            if (err) throw err;
            console.log(conference.id + ' was writed to file!');
        });
    },

    /// <param name="conference" type="Conference">会议</param>
    add: (conference) => {
        fs.appendFile(file, conference, (err) => {
            if (err) throw err;
            console.log(conference.id + ' was appended to file!');
        });
    },

    /// <param name="id" type="String">会议id</param>
    remove: (id) => {
        var data = this.get();
        var removeIndex = data.findIndex((value) => {
            return value.id === id;
        });
        data.splice(removeIndex, 1);
        this.set(JSON.stringify(data));
    }
};