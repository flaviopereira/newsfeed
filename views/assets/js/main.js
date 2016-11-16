$(document).ready(function() {
    //clear error class
    $('.form-control').click(function() {
        $(this).parent().removeClass('has-error');
    });

    $('.sendBtn').click(function() {
        var sendObj = {},
            sendForm = $(this).parents('form'),
            formAction = sendForm.attr('action'),
            formInputs = sendForm.find('.form-control'),
            flag = true;

        formInputs.each(function(i, el) {
            if ($(el).val() == '') {
                $(el).parent().addClass('has-error');
                flag = false;
            }
            sendObj[$(el).attr('data-attr')] = $(el).val();
        });

        if (flag) {
            console.log(sendObj);
            $.post(formAction, sendObj, function(data) {
                if (data.statusCode === 200) {
                    window.location.href = '/nosql';
                } else {
                    alert(data.message);
                }
            });
        }

        return false;
    });

    $('.add-friend').click(function() {
        var friendID = $(this).attr('data-user_id'),
            friendName = $(this).attr('data-user_name');

        $.ajax({
            type: "POST",
            url: "/friend/add",
            data: {
                id: friendID,
                username: friendName
            },
            success: function(data) {
                if (data.statusCode === 200) {
                    alert(data.message);
                } else {
                    alert(data.message);
                }
            }
        });

        return false;
    })
});
