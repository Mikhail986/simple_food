$(function () {
  $('.reviews-slider').slick({
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    appendDots: $('.reviews-slider__dots'),
    appendArrows: $('.reviews-slider__arrow'),
    prevArrow: '<button type="button" class="slick-prev"><img class="slick-prev__icon" src="images/icons/icon-left.svg" alt="prev"></button>',
    nextArrow: '<button type="button" class="slick-next"><img class="slick-next__icon" src="images/icons/icon-right.svg" alt="next"></button>'
  });
});

var mixer = mixitup('.popular-categories__wrapper');
