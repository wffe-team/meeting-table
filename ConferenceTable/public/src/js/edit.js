(function () {
    //编辑
    var edit = (function () {
        return {
            editInput: function (editBtn, targetClass) {
                $('body').on('click', '.' + editBtn, function () {
                    $(this).parents('.meeting').find('.edit-text').prop('readonly', false).addClass(targetClass);
                    $(this).parents('.meeting').find('.datetimepicker1').prop('disabled', false).addClass(targetClass);
                    $(this).parents('.meeting').find('.save,.cancal,.delete').show();
                })
            },
            saveInput: function (saveBtn, targetClass) {
                $('body').on('click', '.' + saveBtn, function () {
                    var $this = $(this);
                    $.ajax({
                        type: "GET",
                        url: $('.lists-wrap').data('url'),
                        data: {                            
                            meetingdate: $this.parents('.metting-bg').siblings('.date').text(),
                            meetingtt: $this.parents('.bd').siblings('.title').find('.mt').val(),
                            meetingroom: $this.parent().siblings('.details').find('.mr').val(),
                            meetingst: $this.parent().siblings('.details').find('.mst').val(),
                            meetinget: $this.parent().siblings('.details').find('.met').val(),
                            meetinguser: $this.parent().siblings('.user').find('.mu').val()
                        },
                        success: function (result) {
                            $this.parents('.meeting').find('.datetimepicker1').prop('disabled', true).removeClass(targetClass);
                            $this.parents('.meeting').find('.edit-text').prop('readonly', true).removeClass(targetClass);
                            $this.hide();
                            $this.siblings('.cancal,.delete').hide();
                        }
                    });
                });
            },
            deleteInput: function (deleteBtn) {
                $('body').on('click', '.' + deleteBtn, function () {
                    $(this).parents('.meeting').remove();
                })
            },
            cancalInput: function (cancalBtn, targetClass) {
                $('body').on('click', '.' + cancalBtn, function () {
                    $(this).parents('.meeting').find('.edit-text').prop('readonly', true).removeClass(targetClass);
                    $(this).parents('.meeting').find('.datetimepicker1').prop('disabled', true).removeClass(targetClass);
                    $(this).parents('.meeting').find('.save,.cancal,.delete').hide();
                    location.reload();
                })
            }
        }
    })()
    edit.editInput('edit', 'focus-input');
    edit.saveInput('save', 'focus-input');
    edit.deleteInput('delete');
    edit.cancalInput('cancal', 'focus-input');
    //增加
    var add = (function () {
        return {
            cancalBtn: function (cancalBtn) {
                $('body').on('click', '.' + cancalBtn, function () {
                    $(this).parent().hide();
                    $(this).parent().prev().show();
                })
            },
            addContent: function () {
                $('body').on('click', '.metting-add', function () {
                    var $mContent = $(this).prev().val();
                    var mettingHtml = "<div class='metting-bg'><div class='meeting new-metting'><div class='title'><input type='text' class='edit-text focus-input mt'  placeholder='会议主题' value=" + $mContent + "></div>"
                        + "<div class='bd'><div class='details clear'><div class='meeting-room'><input type='text' class='edit-text focus-input mr' placeholder='会议室' value=''/></div>"
                        + "<div class='time-start'><input type='text' class='edit-text focus-input datetimepicker1 mst' value=''  placeholder='开始时间' onclick='$(this).datetimepicker({ datepicker: false, step: 5,format: &quot;H:i&quot})'>"
                        + "</div><div>--</div>"
                        + "<div class='time-end'><input type='text' class='edit-text focus-input datetimepicker1 met' value=''  placeholder='结束时间' onclick='$(this).datetimepicker({ datepicker: false, step: 5,format: &quot;H:i&quot})'></div></div>"
                        + "<div class='user'><input type='text' class='edit-text focus-input mu' value='' placeholder='使用人'></div>"
                        + "<div class='handle'><input type='button' class='btn edit' value= '编辑' /><input type='button' class='btn save' value= '保存' /><input type='button' class='btn cancal' value= '取消'/><input type='button' class='btn delete' value= '删除'/></div></div>";
                    $(this).parents('.list-meeting').find('.meeting-wrap').append(mettingHtml);
                    //解决默认添加，点击两次才能出现下拉时间段
                    $('.datetimepicker1').click();
                })
            }
        }
    })()
    add.cancalBtn('cancal-btn');
    add.addContent();
    //时间
    var time = (function () {
        return {
            timeShow: function (currentTime, addDayCount) {
                var time = new Date();
                //获取AddDayCount天后的日期 
                var td = time.getDate();
                time.setDate(td+ addDayCount);
                var dd = time.getDay();
                var y = time.getFullYear();
                var m = time.getMonth() + 1;
                ////考虑周末
                //if (dd == 6 || dd == 0) {
                //    time.setDate(td + addDayCount + 2);
                //} 
                //if (dd == 1 && currentTime =='g-tomorrow') {
                //    time.setDate(td + addDayCount + 2);
                //}
                var d = time.getDate();
                //输出时间
                var time = y + "-" + m + "-" + d;
                $('.' + currentTime).text(time);
            },
            timePeriod: function () {
                $('.datetimepicker1').datetimepicker({
                    datepicker: false,
                    format: 'H:i',
                    step: 5
                });
            }
        }
    })()
    time.timeShow('today', 0);
    time.timeShow('tomorrow', 1);
    time.timeShow('a-tomorrow', 2);
    time.timeShow('g-tomorrow', 3);
    //start-end-time
    time.timePeriod();
})()