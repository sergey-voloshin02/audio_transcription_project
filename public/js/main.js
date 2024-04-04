(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Roadmap carousel
    $(".roadmap-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        dots: false,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 2
            },
            768: {
                items: 3
            },
            992: {
                items: 4
            },
            1200: {
                items: 5
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });


})(jQuery);


document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('modal').style.display = 'none';
});

document.getElementById('audioFile').addEventListener('change', function () {
    var fileInput = this;
    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        document.getElementById('chooseBtnText').innerText = file.name;
    }
});

document.getElementById('convertBtn').addEventListener('click', function () {
    const userToken = localStorage.getItem("userToken");

    if (userToken) {

        var fileInput = document.getElementById('audioFile');

        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];

            var formData = new FormData();
            formData.append('audioFile', file);

            fetch('http://localhost:3000/trans-audio-to-text', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Произошла ошибка при отправке файла на сервер.');
                    }
                    return response.json();
                })
                .then(data => {
                    document.getElementById('resTrans').innerText = data.transcription.text;
                    document.getElementById('modal-content').style.overflow = "visible";
                    document.getElementById('modal-content').style.height = "50%";
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
        } else {
            alert('Пожалуйста, выберите аудио файл для конвертации.');
        }
    } else {
        alert('Авторизуйтесь для користування нашим сервiсом!');
    }
});

document.getElementById('openModal').addEventListener('click', function (event) {
    const userToken = localStorage.getItem("userToken");

    if (userToken) {

        const data = { userToken: userToken };

        fetch('http://localhost:3000/check-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                if (data.result.found == true) {
                    document.getElementById('modal').style.display = 'block';
                } else {
                    localStorage.removeItem('userToken');

                    alert('Авторизуйтесь для користування нашим сервiсом!');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        alert('Авторизуйтесь для користування нашим сервiсом!');
    }
});

document.getElementById('singUpBtn').addEventListener('click', function (event) {
    event.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const passwordCheck = document.getElementById('register-password-check').value;

    // Проверка совпадения паролей
    if (password !== passwordCheck) {
        alert('Your passwords did not match.');
        return;
    }

    const data = { email, password };

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('userToken', data.token);
                alert('Реєстрація пройшла успішно!');
            } else {
                alert('Сталась непедбачена помилка під час реєстрації!');
                console.log('data', data);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

document.getElementById('singInBtn').addEventListener('click', function (event) {
    event.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const data = { email, password };

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('userToken', data.token);
                alert('Реєстрація пройшла успішно!');
                window.location.href = '/index.html';
            } else {
                alert('Сталась непедбачена помилка під час авторизації!');
                console.log('data', data);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


