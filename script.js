$(document).ready(function () {
    let username = getCookie('username');
    let interest = getCookie('interest');

    //check for quote cookie
    if (getCookie('quote')) {
        $('.quotes').html(`" ${getCookie('quote')} " - ${getCookie('quote-author')}`);
    }

    if (!getCookie('quote')) {
        quotes();
    }

    //Handling quote change button

    $('.change-quote').on('click', function () {
        quotes();
    })



    //set the background if the interest cookie is available
    if (getCookie('image')) {
        $('body').css('background-image', `url(${getCookie('image')})`);
        $('.interest').html(`Interest: ${getCookie('interest')}`);

    }


    //If username cookie is available then Input-feild is disabled and only greeting is visible
    if (username) {
        $('.greetings').css('display', 'inline-block');
        $('.input-name').css('display', 'none');
        $('.greetings').html(`Hello ${getCookie('username')}`);
        if (!interest) {
            $('.input-interest').css('display', 'inline-block');
        }
    }

    if (!username) {
        $('.input-name').css('display', 'inline-block');
        $('.input-name').keypress(function (e) {
            if (e.which == 13 && e.target.value != "" && e.target.value != " ") {
                $('.input-name').fadeOut(() => {
                    $('.input-interest').fadeIn();
                });
            }
        });
    }


    //If no username cookie is set then input field takes value and sets the cookie
    $('.input-name').keypress(function (e) {
        if (e.which == 13 && e.target.value != "" && e.target.value != " ") {
            let value = e.target.value;
            if (value) {
                setCookie('username', value, 365);
                $('.input-name').fadeOut(function () {
                    $('.greetings').fadeIn(function () {
                        $('.greetings').html(`Hello ${getCookie('username')}`)
                    });
                })
            } else {
                return;
            }
        }
    });

    //Interest cookie
    $('.input-interest').keypress(function (e) {
        let value = e.target.value;
        if (e.which == 13 && e.target.value != "" && e.target.value != " ") {
            $('.input-interest').fadeOut(function () {
                setCookie('interest', value, 0.5);
                newImage(value);
                $('.interest').html(`Interest: ${value}`);
            })
        }
    });

    //if interest cookie expires
    if (!getCookie('interest')) {
        $('.input-interest').css('display', 'inline-block');
        if (e.which == 13 && e.target.value != "" && e.target.value != " ") {
            $('.input-interest').fadeOut(function () {
                setCookie('interest', value, 0.1);
                newImage(value);
            })
        }
    }

    //if Image-url cookie expires
    if (!getCookie('image')) {
        newImage(getCookie('interest'));
    }

    //Choosing new interest from button
    $('.change-btn').on('click', function () {
        $('.input-interest').css('display', 'inline-block');
    });

    //Dynamic time and date
    let d = new Date()
    $('.time-keeper').html(`${d.getHours()}:${d.getMinutes()}`);
    $('.full-date').html(d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }));


});

//Cookie Setup
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//API call to unsplash to get image:
function newImage(keyword) {

    let url = `https://api.unsplash.com/search/photos?query=${keyword}&per_page=20&orientation=landscape&client_id=MucQGgoCMUZRSBAhrYGvPy5vM869gkVMlMuPxHS92WQ`;
    $.get(url, function (data) {
        let img_url = data.results[0].urls.raw;
        setCookie('image', img_url);
        $('body').css('background-image', `url(${img_url})`);
    });
}

function quotes() {
    let url = "https://quotes15.p.rapidapi.com/quotes/random/?rapidapi-key=0a45cbc86fmsh7a9d3e6d3feaa7ap19ffe6jsn4258fd67d95a"
    $.get(url, function (data) {
        let quote = data.content;
        let author = data.originator.name;
        setCookie('quote', quote, 0.1);
        setCookie('quote-author', author, 0.1)
        $('.quotes').html(`" ${getCookie('quote')} " - ${getCookie('quote-author')}`);
    })
}


