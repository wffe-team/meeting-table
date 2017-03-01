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
        var result = [];
        var workDay = new WorkDay(days);
        workDay.days.forEach((value) => {
            result[value] = [];
        });
        data.forEach((meeting) => {
            if (workDay.days.findIndex(date=>date === meeting.date) > -1) {
                result[meeting.date].push(meeting);
            }
        });
        return result;
    }

    /// <param name="days" type="Number">展示天数</param>
    get(days) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        fs.writeFile(file, '', 'utf8', (err) => { });
                        resolve(this.groupByDay(days, []));
                    } else {
                        console.log('读取文件' + file + '出错');
                        throw err;
                    }
                } else {
                    resolve(this.groupByDay(days, JSON.parse('[' + data + ']')));
                }
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
        this.get().then((data) => {
            var removeIndex = data.findIndex((value) => {
                return value.id === id;
            });
            data.splice(removeIndex, 1);
            var str = JSON.stringify(data);
            this.set(str.slice(1, str.length - 1));
        });
    }

    /// <param name="meeting" type="Meeting">会议</param>
    update(meeting) {
        this.remove(meeting.id);
        this.add(meeting);
    }
}

module.exports = DataAccessor;