function login_validation()
{
    var handle = document.forms['inForm']['uname2'].value;
    var password = document.forms['inForm']['pass2'].value;

    var hr = new XMLHttpRequest();
    hr.onreadystatechange = function()
    {
        if(hr.readyState == 4 && hr.status == 200)
        {
            result = hr.responseText;
            alert(result);
            result=JSON.parse(result);
            document.getElementById("v_Handle2").innerHTML = result['handle'];

            if(result["status"] != 'failed')
            {
                document.getElementById("inForm").submit();
            }
        }
    };
    var v = "handle="+handle+"&"+"password="+password;
    hr.open('POST', '/login', true);
    hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    hr.send(v);
    console.log(v);
}

function signup_validation()
{
    var handle = document.forms['upForm']['uname'].value;
    var password = document.forms['upForm']['pass1'].value;
    var passVal = document.forms['upForm']['pass1val'].value;

    var hr = new XMLHttpRequest();
    hr.onreadystatechange = function()
    {
        if(hr.readyState == 4 && hr.status == 200)
        {
            result = hr.responseText;
            alert(result);
            result=JSON.parse(result);
            console.log("DEsrwewf: " + result);
            document.getElementById("v_Handle").innerHTML = result['handle'];
            document.getElementById("v_Pass").innerHTML = result['password'];

            if(result['status'] != 'failed')
            {
                alert("Signed up, please  log in");
                document.getElementById("upForm").submit();
            }
        }
    };
    var v = "handle="+ handle + "&" + "password=" + password + "&" + "passVal=" + passVal;
    hr.open('POST', '/signup', true);
    hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    hr.send(v);
    console.log(v);
}

$("#register").click(function () {
    signup_validation();
});

$("#signin").click(function () {
    // I wanna get the user data here and send it to server
    login_validation();
});

$('.form').find('input, textarea').on('keyup blur focus', function (e) {

    var $this = $(this),
        label = $this.prev('label');

    if (e.type === 'keyup') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if( $this.val() === '' ) {
            label.removeClass('active highlight');
        } else {
            label.removeClass('highlight');
        }
    } else if (e.type === 'focus') {

        if( $this.val() === '' ) {
            label.removeClass('highlight');
        }
        else if( $this.val() !== '' ) {
            label.addClass('highlight');
        }
    }

});

$('.tab a').on('click', function (e) {

    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.tab-content > div').not(target).hide();

    $(target).fadeIn(600);

});

