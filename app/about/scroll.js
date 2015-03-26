$(window).scroll(function() {
    var scrollVal = $(window).scrollTop();

    $(".overlay").css("opacity", scrollVal / 400);

    if (scrollVal >= $('.main').offset().top)
        $(".navbar").toggleClass('fadeInDown animated');
    else
        $(".navbar").removeClass('fadeInDown animated');
});


