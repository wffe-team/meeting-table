var fs = require('fs');
var Conference = require('../model/Conference');
var ConferenceTable = require('../model/ConferenceTable');
var WorkDay = require('../code/workDay');
var prefix = ',';
var file = 'conferenceData.txt';

class DataAccessor {

    /// <param name="days" type="Number">天数</param>
    /// <param name="data" type="Array">会议数据</param>
    groupByDay(days, data) {
        var result = [];
        var workDay = new WorkDay(days);
        workDay.days.forEach((value) => {
            result[value] = [];
        });
        data.forEach((conference) => {
            if (workDay.days.findIndex(date=>date === conference.date) > -1) {
                result[conference.date].push(conference);
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
                        resolve([]);
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

    /// <param name="conference" type="Conference">会议</param>
    add(conference) {
        //TODO:检查
        return this.get().then((data) => {
            prefix = data.length == 0 ? '' : prefix;
            return new Promise((resolve, reject) => {
                fs.appendFile(file, prefix + JSON.stringify(conference), 'utf8', (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                        console.log(conference.id + ' was appended to file!');
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

    /// <param name="conference" type="Conference">会议</param>
    update(conference) {
        this.remove(conference.id);
        this.add(conference);
    }
}

module.exports = DataAccessor;