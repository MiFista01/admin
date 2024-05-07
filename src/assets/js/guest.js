function initSwiper(element) {
  const swiper = new Swiper(element, {
    effect: "coverflow",
    mousewheel: true,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
    },
  });
}