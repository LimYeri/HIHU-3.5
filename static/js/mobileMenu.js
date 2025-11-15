var hotNavBtn = document.querySelector(".hotMenuContainer");
var hotNav = document.querySelector(".hotNavContainer");
var hotCloseBtn = document.querySelector(".hotMenuClose");

hotNavBtn.addEventListener("click", () => {
    hotNav.style.display = "flex"
    hotNavBtn.style.display = "none"
    hotCloseBtn.style.display = "flex"
})

hotCloseBtn.addEventListener("click", () => {
    hotNav.style.display = "none"
    hotNavBtn.style.display = "flex"
    hotCloseBtn.style.display = "none"
})

var compressorNotice = document.getElementById("compressorNotice");
var compressorItemNotice = document.getElementById("cItemNotice");
var noticeCBtn = document.querySelector(".noticeCBtn");

var compressorCalendar = document.getElementById("compressorCalendar");
var compressorItemCalendar = document.getElementById("cItemCalendar");
var calendarCBtn = document.querySelector(".calendarCBtn");

var compressorBus = document.getElementById("compressorBus");
var compressorItemBus = document.getElementById("cItemBus");
var busCBtn = document.querySelector(".busCBtn");

var compressorRestaurant = document.getElementById("compressorRestaurant");
var compressorItemRestaurant = document.getElementById("cItemRestaurant");
var restaurantCBtn = document.querySelector(".restaurantCBtn");

var compressorSchool = document.getElementById("compressorSchool");
var compressorItemSchool = document.getElementById("cItemSchool");
var schoolCBtn = document.querySelector(".schoolCBtn");

compressorNotice.addEventListener("click", () => {
    compressorItemNotice.style.display = "flex"
    compressorItemCalendar.style.display = "none"
    compressorItemBus.style.display = "none"
    compressorItemRestaurant.style.display = "none"
    compressorItemSchool.style.display = "none"

    schoolCBtn.style.transform = "rotate( 0deg )"
    noticeCBtn.style.transform = "rotate( 90deg )"
    calendarCBtn.style.transform = "rotate( 0deg )"
    busCBtn.style.transform = "rotate( 0deg )"
    restaurantCBtn.style.transform = "rotate( 0deg )"
});

compressorCalendar.addEventListener("click", () => {
    compressorItemCalendar.style.display = "flex"
    compressorItemNotice.style.display = "none"
    compressorItemBus.style.display = "none"
    compressorItemRestaurant.style.display = "none"
    compressorItemSchool.style.display = "none"

    schoolCBtn.style.transform = "rotate( 0deg )"
    noticeCBtn.style.transform = "rotate( 0deg )"
    calendarCBtn.style.transform = "rotate( 90deg )"
    busCBtn.style.transform = "rotate( 0deg )"
    restaurantCBtn.style.transform = "rotate( 0deg )"
});

compressorBus.addEventListener("click", () => {
    compressorItemBus.style.display = "flex"
    compressorItemNotice.style.display = "none"
    compressorItemCalendar.style.display = "none"
    compressorItemRestaurant.style.display = "none"
    compressorItemSchool.style.display = "none"

    schoolCBtn.style.transform = "rotate( 0deg )"
    noticeCBtn.style.transform = "rotate( 0deg )"
    calendarCBtn.style.transform = "rotate( 0deg )"
    busCBtn.style.transform = "rotate( 90deg )"
    restaurantCBtn.style.transform = "rotate( 0deg )"
});

compressorRestaurant.addEventListener("click", () => {
    compressorItemRestaurant.style.display = "flex"
    compressorItemNotice.style.display = "none"
    compressorItemCalendar.style.display = "none"
    compressorItemBus.style.display = "none"
    compressorItemSchool.style.display = "none"
    
    schoolCBtn.style.transform = "rotate( 0deg )"
    noticeCBtn.style.transform = "rotate( 0deg )"
    calendarCBtn.style.transform = "rotate( 0deg )"
    busCBtn.style.transform = "rotate( 0deg )"
    restaurantCBtn.style.transform = "rotate( 90deg )"
});

compressorSchool.addEventListener("click", () => {
    compressorItemSchool.style.display = "flex"
    compressorItemNotice.style.display = "none"
    compressorItemCalendar.style.display = "none"
    compressorItemBus.style.display = "none"
    compressorItemRestaurant.style.display = "none"
    schoolCBtn.style.transform = "rotate( 90deg )"
    noticeCBtn.style.transform = "rotate( 0deg )"
    calendarCBtn.style.transform = "rotate( 0deg )"
    busCBtn.style.transform = "rotate( 0deg )"
    restaurantCBtn.style.transform = "rotate( 0deg )"
});

window.addEventListener("resize", () => {
    hotNav.style.display = "none"
    hotNavBtn.style.display = "flex"
    hotCloseBtn.style.display = "none"
})