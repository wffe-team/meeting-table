(function () {
    ////编辑
    //var inputEdit = (function () {
    //    return {
    //        focus: function (targetClick,targetClass) {
    //            $('.' + targetClick).click(function () {
    //                $(this).prop('readonly', false).addClass(targetClass);
    //            })
    //        },
    //        blur: function (targetClick, targetClass) {
    //            $('.' + targetClick).blur(function () {
    //                $(this).prop('readonly', true).removeClass(targetClass);
    //            })
    //        }
    //    }
    //})()
    //inputEdit.focus('edit', 'focus-input');
    //inputEdit.blur('edit', 'focus-input');

    //编辑
    var edit = (function () {
        return {
            editInput: function (editBtn,targetClass) {
                $('body').on('click', '.' + editBtn,function () {
                    $(this).parents('.meeting').find('.edit').prop('readonly', false).addClass(targetClass);
                    $(this).parents('.meeting').find('.save,.dele').show();
                })
            },
            saveInput: function (saveBtn,targetClass) {
                $('body').on('click','.' + saveBtn,function () {
                    $(this).parents('.meeting').find('.edit').prop('readonly', true).removeClass(targetClass);
                    $(this).hide();
                })
            }
        }
    })()
    edit.editInput('icon-edit','focus-input');
    edit.saveInput('save', 'focus-input');
    //增加
    var add = (function () {
        return {
            mettingAdd: function (targetAdd, targetText) {
                $('body').on('click', '.'+targetAdd, function () {
                  $(this).next('.'+targetText).show();
                    $(this).hide();
                })
            },
            cancalBtn: function (cancalBtn) {
                $('body').on('click', '.' + cancalBtn, function () {
                    $(this).parent().hide();
                    $(this).parent().prev().show();
                })
            },
            addContent: function () {
                $('body').on('click', '.add-btn', function () {
                  var $mContent = $(this).prev().val();
                  var mettingHtml = "<div class='meeting'><div class='title'><input type='text' class='edit' placeholder='' readonly value="+$mContent+"></div>"
                      + "<div class='bd'><div class='details clear'><div class='meetingRoom'><input type='text' class='edit' placeholder='会议室' value='' readonly></div>"
                      + "<div class='timeStart'><input type='text' class='edit' value='' placeholder='开始时间' readonly></div><div>-</div>"
                      + "<div class='timeEnd'><input type='text' class='edit' value='' placeholder='结束时间' readonly></div></div>"
                      + "<div class='user'><button class='save'>保存</button><input type='text' class='edit' value='' placeholder='使用人' readonly></div>"
                      + "<div class='icon-edit'>编辑</div></div></div>";
                  $(this).parents('.list-meeting').find('.meeting').last().after(mettingHtml);
                })
            }
        }
    })()
    add.mettingAdd('metting-add', 'metting-text');
    add.cancalBtn('cancal-btn');
    add.addContent();
})()