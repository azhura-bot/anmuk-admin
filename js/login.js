$(document).ready(function() {
    $("#login").click(function() {
        var uid = $("#uid").val();
        var password = $("#password").val();

        if (uid === '' || password === '') {
            $('input[type="text"], input[type="password"]').css("border", "2px solid red");
            $('input[type="text"], input[type="password"]').css("box-shadow", "0 0 3px red");
            alert("Please fill all fields!");
        } else {
            if (password.length < 4) {
                $('input[type="password"]').css("border", "2px solid red");
                $('input[type="password"]').css("box-shadow", "0 0 3px red");
                alert("Password must be at least 4 characters");
                $('#password').val('');
            } else {
                if (uid === 'admin' && password === 'admin') {
                    alert('Welcome ' + uid + '.');
                    window.location.href = 'home.html';
                } else {
                    alert('Invalid username or password!');
                }
            }
        }
    });

    $("input").focus(function() {
        $(this).css("background-color", "#cccccc");
        $(this).css("color", "#000");
    });

    $("input").blur(function() {
        $(this).css("background-color", "#ffffff");
        $(this).css("color", "#4f4f4f");
    });
});
