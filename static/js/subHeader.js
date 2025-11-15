//헤더에 들어가는 서브헤더 여는 기능

var notice = document.querySelector(".noticehead");
var calendar = document.querySelector(".calendarhead");
var bus = document.querySelector(".bushead");
var restaurant = document.querySelector(".restauranthead");
var hanseo = document.querySelector(".hanseohead");
var none1 = document.querySelector(".none1");
// var none2 = document.querySelector(".none2");
var none3 = document.querySelector(".none3");

var subNotice = document.querySelector(".noticeMenu");
var subCalendar = document.querySelector(".calendarMenu");
var subBus = document.querySelector(".busMenu");
var subRestaurant = document.querySelector(".restaurantMenu");
var subHanseo = document.querySelector(".hanseoMenu");

var hero = document.querySelector(".hero");

const noticeOpen = () => {
    $(subNotice).css("display", "flex");
    busClose();
    restaurantClose();
    calendarClose();
    hanseoClose();
}

const noticeClose = () => {
    $(subNotice).css("display", "none");
}

const calendarOpen = () => {
    $(subCalendar).css("display", "flex");
    noticeClose();
    busClose();
    restaurantClose();
    hanseoClose();
}

const calendarClose = () => {
    $(subCalendar).css("display", "none");
}

const busOpen = () => {
    $(subBus).css("display", "flex");
    noticeClose();
    restaurantClose();
    calendarClose();
    hanseoClose();
}

const busClose = () => {
    $(subBus).css("display", "none");
}

const restaurantOpen = () => {
    $(subRestaurant).css("display", "flex");
    noticeClose();
    busClose();
    calendarClose();
    hanseoClose();
}

const restaurantClose = () => {
    $(subRestaurant).css("display", "none");
}

const hanseoOpen = () => {
    $(subHanseo).css("display", "flex");
    noticeClose();
    busClose();
    calendarClose();
    restaurantClose();
}

const hanseoClose = () => {
    $(subHanseo).css("display", "none");
}

$(notice).mouseover(noticeOpen);
$(bus).mouseover(busOpen);
$(restaurant).mouseover(restaurantOpen);
$(calendar).mouseover(calendarOpen);
$(hanseo).mouseover(hanseoOpen);

$(none1).mouseover(() => {
    noticeClose();
    busClose();
    restaurantClose();
    calendarClose();
    hanseoClose();
});

// $(none2).mouseover(() => {
//     noticeClose();
//     busClose();
//     restaurantClose();
// });

$(none3).mouseover(() => {
    noticeClose();
    calendarClose();
    busClose();
    restaurantClose();
    hanseoClose();
});

$(hero).mouseover(() => {
    noticeClose();
    busClose();
    restaurantClose();
    calendarClose();
    hanseoClose();
});