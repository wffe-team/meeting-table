var fs = require('fs');
var Meeting = require('../model/Meeting');
var MeetingTable = require('../model/MeetingTable');
var WorkDay = require('../code/workDay');
var file = 'data/meetingData.txt';

/**
 * meeting数据访问
 */
class DataAccessor {

    /// <param name="days" type="Number">天数</param>
    /// <param name="data" type="Array">会议数据</param>
    groupByDay(days, data) {
        if (!days) {
            return data;
        }
        var result = [];
        var workDay = new WorkDay(days);
        workDay.days.forEach((value) => {
            result.push({ date: value, meetings: [] })
        });
        data.forEach((meeting) => {
            if (workDay.days.findIndex(date=>date === meeting.date) > -1) {
                result.forEach((item) => {
                    if (item.date == meeting.date) {
                        item.meetings.push(meeting);
                    }
                });
            }
        });
        return result;
    }

    /// <param name="days" type="Number">展示天数</param>
    get(days) {
        var me = this;
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (err, data) => {
                var empty = function () {
                    fs.writeFile(file, '', 'utf8', (err) => { });
                    resolve(me.groupByDay(days, []));
                }
                if (err) {
                    if (err.code === 'ENOENT') {
                        empty();
                    } else {
                        console.log('读取文件' + file + '出错');
                        throw err;
                    }
                    return;
                }
                if (!data) {
                    empty();
                    return;
                }
                resolve(me.groupByDay(days, JSON.parse('[' + data + ']')));
            });
        });
    }

    /// <param name="text" type="String">会议文本</param>
    set(text) {
        return new Promise((resolve, reject) => {
            fs.writeFile(file, text, 'utf8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /// <param name="meeting" type="Meeting">会议</param>
    add(meeting) {
        //TODO:检查
        return this.get().then((data) => {
            var prefix = data.length == 0 ? '' : ',';
            return new Promise((resolve, reject) => {
                fs.appendFile(file, prefix + JSON.stringify(meeting), 'utf8', (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                        console.log(meeting.id + ' was appended to file!');
                    }
                });
            });
        });
    }

    /// <param name="id" type="String">会议id</param>
    remove(id) {
        return new Promise((resolve, reject) => {
            this.get().then((data) => {
                var removeIndex = data.findIndex((value) => {
                    return value.id === id;
                });
                data.splice(removeIndex, 1);
                var str = JSON.stringify(data);
                this.set(str.slice(1, str.length - 1)).then(_=> {
                    resolve();
                });
            });
        });
    }

    /// <param name="meeting" type="Meeting">会议</param>
    update(meeting) {
        var me = this;
        this.remove(meeting.id).then(() => {
            me.add(meeting);
        });        
    }
}

module.exports = DataAccessor;