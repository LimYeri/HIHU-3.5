//홈화면 슬라이드 배너에 들어감
//어바웃에도 들어갈 예정 현재 수정중

var slides = document.querySelector('.slides');
var slide = document.querySelector('.slides li');
var currentIdx = 0;
// var slideCount = slide.length;
var slideCount = document.getElementsByTagName('li').length - 2;
var prevBtn = document.querySelector('.prev');
var nextBtn = document.querySelector('.next');
var slideWidth = parseInt($(window).width() + 'px');

var totalTime = 4000;
var current_Time = 0;
var refresh_interval = 50;
var tTimer;

var timer = undefined;

slides.style.width = (slideWidth) * slideCount + 'px';

//페이지네이션을 위한 제이쿼리 문법
// $(".page p").text((currentIdx + 1) + "/" + slideCount);
const pagination = () => {
  $(".page p").text((currentIdx + 1) + "/" + slideCount);
}

pagination();

//페이지 넘기는 함수
const moveSlide = (num) => {
  // slides.style.left = -num * (slideWidth) + 'px';
  slides.style.left = -num * 100 + 'vw';
  currentIdx = num;
  $(".page p").text((currentIdx + 1) + "/" + slideCount);
}

//다음 버튼 눌렀을 경우 슬라이드 이동을 위한 변수 변화
nextBtn.addEventListener('click', () => {
  if(currentIdx < slideCount - 1) {
    moveSlide(currentIdx + 1);
  } else {
    moveSlide(0);
  }
});

//이전 버튼 눌렀을 경우 슬라이드 이동을 위한 변수 변화
prevBtn.addEventListener('click', () => {
  if(currentIdx > 0) {
    moveSlide(currentIdx - 1);
  } else {
    moveSlide(slideCount - 1);
  }
})

//clearInterval(timer);
//자동 슬라이드 구현
const autoSlide = () => {
  if(timer == undefined) {
    timer = setInterval(() => {
      if(currentIdx < slideCount - 1) {
        moveSlide(currentIdx + 1);
      } else {
        moveSlide(0);
      }
    }, 4000);
  }
}

autoSlide();

const stopSlide = () => {
  clearInterval(timer);
  timer = undefined;
}

var playBtn = document.querySelector(".stopGo")
var switchBtn = 0;

playBtn.addEventListener('click', () => {

  if(switchBtn == 0) {
    stopSlide();
    switchBtn = 1;
  } else {
    autoSlide();
    switchBtn = 0;
  }
});
