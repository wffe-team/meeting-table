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
                    $(this).parents('.meeting').find('.save').show();
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
            }
        }
    })()
    add.mettingAdd('metting-add', 'metting-text');
    add.cancalBtn('cancal-btn');
})()