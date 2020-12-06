(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
$(function () {

  //변수 선언
	var container = $('.slideshow_stack'),
		slideGroup = container.find('.slideshow-slides_stack'),
		slides = slideGroup.find('.slide_stack'),
		nav = container.find('.slideshow-nav_stack'),
		indicator = container.find('.slideshow-indicator_stack'), 
		slideCount = slides.length,
		indicatorHTML ='',
		currentIndex = 0,
		duration = '',
		easing = 'easeInOutExpo';
		

  
	slides.each(function(i){
		$(this).css({left:100 * i +'%'});
		indicatorHTML += '<a href="#">' + (i + 1) + '</a>';
	});
	console.log(indicatorHTML);  
	
	indicator.html(indicatorHTML);
	//.html(내용)  내용을 html 형식으로 추가(교체)한다.
	//.text(내용)  내용을 text 형식으로 추가(교체)한다.
	
	//moveSlide()  슬라이드를 이전, 다음 이동하는 함수, 인디케이터.. 	
	//viewButton() 클릭하면 슬라이드를 이동, 처음,끝을 구분하여 버튼을 표시..
	
	function moveSlide(index){
		slideGroup.animate({left: -100 * index +'%'},duration,easing);
		currentIndex = index;
		viewButton(); //처음인지 마지막인지 검사해주는 함수

	}

	function viewButton(){    //버튼 페이지에 따라 안보이게함
		var navPrev = nav.find('.prev_stack'),
			navNext = nav.find('.next_stack');
			
			if(currentIndex == 0){ //처음
				navPrev.addClass('disabled'); 
			}else{
				navPrev.removeClass('disabled');
			}
			
			if(currentIndex == slideCount - 1){ //마지막
				navNext.addClass('disabled');
			}else{
				navNext.removeClass('disabled');
			}	
		indicator.find('a').removeClass('active') 
		.eq(currentIndex).addClass('active'); //.eq(숫자) 숫자에 해당하는 요소 선택
			
	} //viewButton
	
	nav.find('a').click(function(e){
		e.preventDefault(); //기본기능 막히기
		if($(this).hasClass('prev_stack')){  //hasClass를 이용하여 클래스명 prev가 있는지 확인. 점 찍으면 안됨
			moveSlide(currentIndex - 1);
		} else {
			moveSlide(currentIndex + 1);
		}
	});

	
	indicator.find('a').click(function(){
		var idx = $(this).index();
		console.log(idx);
		moveSlide(idx);
	});//인디케이터 클릭으로 이동하기
	

	moveSlide(currentIndex);
		
	
});











},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy90dXRvcmlhbC9pbmRleF9zdGFjay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJChmdW5jdGlvbiAoKSB7XHJcblxyXG4gIC8v67OA7IiYIOyEoOyWuFxyXG5cdHZhciBjb250YWluZXIgPSAkKCcuc2xpZGVzaG93X3N0YWNrJyksXHJcblx0XHRzbGlkZUdyb3VwID0gY29udGFpbmVyLmZpbmQoJy5zbGlkZXNob3ctc2xpZGVzX3N0YWNrJyksXHJcblx0XHRzbGlkZXMgPSBzbGlkZUdyb3VwLmZpbmQoJy5zbGlkZV9zdGFjaycpLFxyXG5cdFx0bmF2ID0gY29udGFpbmVyLmZpbmQoJy5zbGlkZXNob3ctbmF2X3N0YWNrJyksXHJcblx0XHRpbmRpY2F0b3IgPSBjb250YWluZXIuZmluZCgnLnNsaWRlc2hvdy1pbmRpY2F0b3Jfc3RhY2snKSwgXHJcblx0XHRzbGlkZUNvdW50ID0gc2xpZGVzLmxlbmd0aCxcclxuXHRcdGluZGljYXRvckhUTUwgPScnLFxyXG5cdFx0Y3VycmVudEluZGV4ID0gMCxcclxuXHRcdGR1cmF0aW9uID0gJycsXHJcblx0XHRlYXNpbmcgPSAnZWFzZUluT3V0RXhwbyc7XHJcblx0XHRcclxuXHJcbiAgXHJcblx0c2xpZGVzLmVhY2goZnVuY3Rpb24oaSl7XHJcblx0XHQkKHRoaXMpLmNzcyh7bGVmdDoxMDAgKiBpICsnJSd9KTtcclxuXHRcdGluZGljYXRvckhUTUwgKz0gJzxhIGhyZWY9XCIjXCI+JyArIChpICsgMSkgKyAnPC9hPic7XHJcblx0fSk7XHJcblx0Y29uc29sZS5sb2coaW5kaWNhdG9ySFRNTCk7ICBcclxuXHRcclxuXHRpbmRpY2F0b3IuaHRtbChpbmRpY2F0b3JIVE1MKTtcclxuXHQvLy5odG1sKOuCtOyaqSkgIOuCtOyaqeydhCBodG1sIO2YleyLneycvOuhnCDstpTqsIAo6rWQ7LK0Ke2VnOuLpC5cclxuXHQvLy50ZXh0KOuCtOyaqSkgIOuCtOyaqeydhCB0ZXh0IO2YleyLneycvOuhnCDstpTqsIAo6rWQ7LK0Ke2VnOuLpC5cclxuXHRcclxuXHQvL21vdmVTbGlkZSgpICDsiqzrnbzsnbTrk5zrpbwg7J207KCELCDri6TsnYwg7J2064+Z7ZWY64qUIO2VqOyImCwg7J2465SU7LyA7J207YSwLi4gXHRcclxuXHQvL3ZpZXdCdXR0b24oKSDtgbTrpq3tlZjrqbQg7Iqs65287J2065Oc66W8IOydtOuPmSwg7LKY7J2MLOuBneydhCDqtazrtoTtlZjsl6wg67KE7Yq87J2EIO2RnOyLnC4uXHJcblx0XHJcblx0ZnVuY3Rpb24gbW92ZVNsaWRlKGluZGV4KXtcclxuXHRcdHNsaWRlR3JvdXAuYW5pbWF0ZSh7bGVmdDogLTEwMCAqIGluZGV4ICsnJSd9LGR1cmF0aW9uLGVhc2luZyk7XHJcblx0XHRjdXJyZW50SW5kZXggPSBpbmRleDtcclxuXHRcdHZpZXdCdXR0b24oKTsgLy/sspjsnYzsnbjsp4Ag66eI7KeA66eJ7J247KeAIOqygOyCrO2VtOyjvOuKlCDtlajsiJhcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB2aWV3QnV0dG9uKCl7ICAgIC8v67KE7Yq8IO2OmOydtOyngOyXkCDrlLDrnbwg7JWI67O07J206rKM7ZWoXHJcblx0XHR2YXIgbmF2UHJldiA9IG5hdi5maW5kKCcucHJldl9zdGFjaycpLFxyXG5cdFx0XHRuYXZOZXh0ID0gbmF2LmZpbmQoJy5uZXh0X3N0YWNrJyk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZihjdXJyZW50SW5kZXggPT0gMCl7IC8v7LKY7J2MXHJcblx0XHRcdFx0bmF2UHJldi5hZGRDbGFzcygnZGlzYWJsZWQnKTsgXHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdG5hdlByZXYucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmKGN1cnJlbnRJbmRleCA9PSBzbGlkZUNvdW50IC0gMSl7IC8v66eI7KeA66eJXHJcblx0XHRcdFx0bmF2TmV4dC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bmF2TmV4dC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0fVx0XHJcblx0XHRpbmRpY2F0b3IuZmluZCgnYScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKSBcclxuXHRcdC5lcShjdXJyZW50SW5kZXgpLmFkZENsYXNzKCdhY3RpdmUnKTsgLy8uZXEo7Iir7J6QKSDsiKvsnpDsl5Ag7ZW064u57ZWY64qUIOyalOyGjCDshKDtg51cclxuXHRcdFx0XHJcblx0fSAvL3ZpZXdCdXR0b25cclxuXHRcclxuXHRuYXYuZmluZCgnYScpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOyAvL+q4sOuzuOq4sOuKpSDrp4ntnojquLBcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoJ3ByZXZfc3RhY2snKSl7ICAvL2hhc0NsYXNz66W8IOydtOyaqe2VmOyXrCDtgbTrnpjsiqTrqoUgcHJlduqwgCDsnojripTsp4Ag7ZmV7J24LiDsoJAg7LCN7Jy866m0IOyViOuQqFxyXG5cdFx0XHRtb3ZlU2xpZGUoY3VycmVudEluZGV4IC0gMSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRtb3ZlU2xpZGUoY3VycmVudEluZGV4ICsgMSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdFxyXG5cdGluZGljYXRvci5maW5kKCdhJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBpZHggPSAkKHRoaXMpLmluZGV4KCk7XHJcblx0XHRjb25zb2xlLmxvZyhpZHgpO1xyXG5cdFx0bW92ZVNsaWRlKGlkeCk7XHJcblx0fSk7Ly/snbjrlJTsvIDsnbTthLAg7YG066at7Jy866GcIOydtOuPme2VmOq4sFxyXG5cdFxyXG5cclxuXHRtb3ZlU2xpZGUoY3VycmVudEluZGV4KTtcclxuXHRcdFxyXG5cdFxyXG59KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiJdfQ==
