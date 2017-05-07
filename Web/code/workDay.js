/**
 * 计算给定天数的工作日
 */
class WorkDay {

    /// <param name="date" type="Date">日期</param>
    /// <param name="format" type="String">日期格式化</param>
    dateFormat(date, format) {
        var dateMap = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S+': date.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in dateMap) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                       ? dateMap[k] : ('00' + dateMap[k]).substr(('' + dateMap[k]).length));
            }
        }
        return format;
    }

    /// <param name="date" type="Date">当前日期</param>
    nextDay(date) {
        return new Date(date.getTime() + 24 * 60 * 60 * 1000);
    }

    /// <param name="days" type="Number">工作日天数</param>
    constructor(days) {
        var currentDay = new Date();
        this.days = [];
        while (this.days.length < days) {
            if (0 < currentDay.getDay() && currentDay.getDay() < 6) {
                this.days.push(this.dateFormat(currentDay, 'yyyy-MM-dd'));
            }
            currentDay = this.nextDay(currentDay);
        }
    }
}

module.exports = WorkDay;