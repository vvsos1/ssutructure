(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
$(function () {

  //변수 선언
	var container = $('.slideshow_hash'),
		slideGroup = container.find('.slideshow-slides_hash'),
		slides = slideGroup.find('.slide_hash'),
		nav = container.find('.slideshow-nav_hash'),
		indicator = container.find('.slideshow-indicator_hash'), 
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
		var navPrev = nav.find('.prev_hash'),
			navNext = nav.find('.next_hash');
			
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
		if($(this).hasClass('prev_hash')){  //hasClass를 이용하여 클래스명 prev가 있는지 확인. 점 찍으면 안됨
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy90dXRvcmlhbC9pbmRleF9oYXNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIkKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgLy/rs4DsiJgg7ISg7Ja4XHJcblx0dmFyIGNvbnRhaW5lciA9ICQoJy5zbGlkZXNob3dfaGFzaCcpLFxyXG5cdFx0c2xpZGVHcm91cCA9IGNvbnRhaW5lci5maW5kKCcuc2xpZGVzaG93LXNsaWRlc19oYXNoJyksXHJcblx0XHRzbGlkZXMgPSBzbGlkZUdyb3VwLmZpbmQoJy5zbGlkZV9oYXNoJyksXHJcblx0XHRuYXYgPSBjb250YWluZXIuZmluZCgnLnNsaWRlc2hvdy1uYXZfaGFzaCcpLFxyXG5cdFx0aW5kaWNhdG9yID0gY29udGFpbmVyLmZpbmQoJy5zbGlkZXNob3ctaW5kaWNhdG9yX2hhc2gnKSwgXHJcblx0XHRzbGlkZUNvdW50ID0gc2xpZGVzLmxlbmd0aCxcclxuXHRcdGluZGljYXRvckhUTUwgPScnLFxyXG5cdFx0Y3VycmVudEluZGV4ID0gMCxcclxuXHRcdGR1cmF0aW9uID0gJycsXHJcblx0XHRlYXNpbmcgPSAnZWFzZUluT3V0RXhwbyc7XHJcblx0XHRcclxuXHJcbiAgXHJcblx0c2xpZGVzLmVhY2goZnVuY3Rpb24oaSl7XHJcblx0XHQkKHRoaXMpLmNzcyh7bGVmdDoxMDAgKiBpICsnJSd9KTtcclxuXHRcdGluZGljYXRvckhUTUwgKz0gJzxhIGhyZWY9XCIjXCI+JyArIChpICsgMSkgKyAnPC9hPic7XHJcblx0fSk7XHJcblx0Y29uc29sZS5sb2coaW5kaWNhdG9ySFRNTCk7ICBcclxuXHRcclxuXHRpbmRpY2F0b3IuaHRtbChpbmRpY2F0b3JIVE1MKTtcclxuXHQvLy5odG1sKOuCtOyaqSkgIOuCtOyaqeydhCBodG1sIO2YleyLneycvOuhnCDstpTqsIAo6rWQ7LK0Ke2VnOuLpC5cclxuXHQvLy50ZXh0KOuCtOyaqSkgIOuCtOyaqeydhCB0ZXh0IO2YleyLneycvOuhnCDstpTqsIAo6rWQ7LK0Ke2VnOuLpC5cclxuXHRcclxuXHQvL21vdmVTbGlkZSgpICDsiqzrnbzsnbTrk5zrpbwg7J207KCELCDri6TsnYwg7J2064+Z7ZWY64qUIO2VqOyImCwg7J2465SU7LyA7J207YSwLi4gXHRcclxuXHQvL3ZpZXdCdXR0b24oKSDtgbTrpq3tlZjrqbQg7Iqs65287J2065Oc66W8IOydtOuPmSwg7LKY7J2MLOuBneydhCDqtazrtoTtlZjsl6wg67KE7Yq87J2EIO2RnOyLnC4uXHJcblx0XHJcblx0ZnVuY3Rpb24gbW92ZVNsaWRlKGluZGV4KXtcclxuXHRcdHNsaWRlR3JvdXAuYW5pbWF0ZSh7bGVmdDogLTEwMCAqIGluZGV4ICsnJSd9LGR1cmF0aW9uLGVhc2luZyk7XHJcblx0XHRjdXJyZW50SW5kZXggPSBpbmRleDtcclxuXHRcdHZpZXdCdXR0b24oKTsgLy/sspjsnYzsnbjsp4Ag66eI7KeA66eJ7J247KeAIOqygOyCrO2VtOyjvOuKlCDtlajsiJhcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB2aWV3QnV0dG9uKCl7ICAgIC8v67KE7Yq8IO2OmOydtOyngOyXkCDrlLDrnbwg7JWI67O07J206rKM7ZWoXHJcblx0XHR2YXIgbmF2UHJldiA9IG5hdi5maW5kKCcucHJldl9oYXNoJyksXHJcblx0XHRcdG5hdk5leHQgPSBuYXYuZmluZCgnLm5leHRfaGFzaCcpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoY3VycmVudEluZGV4ID09IDApeyAvL+yymOydjFxyXG5cdFx0XHRcdG5hdlByZXYuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7IFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRuYXZQcmV2LnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZihjdXJyZW50SW5kZXggPT0gc2xpZGVDb3VudCAtIDEpeyAvL+uniOyngOuniVxyXG5cdFx0XHRcdG5hdk5leHQuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdG5hdk5leHQucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdH1cdFxyXG5cdFx0aW5kaWNhdG9yLmZpbmQoJ2EnKS5yZW1vdmVDbGFzcygnYWN0aXZlJykgXHJcblx0XHQuZXEoY3VycmVudEluZGV4KS5hZGRDbGFzcygnYWN0aXZlJyk7IC8vLmVxKOyIq+yekCkg7Iir7J6Q7JeQIO2VtOuLue2VmOuKlCDsmpTshowg7ISg7YOdXHJcblx0XHRcdFxyXG5cdH0gLy92aWV3QnV0dG9uXHJcblx0XHJcblx0bmF2LmZpbmQoJ2EnKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTsgLy/quLDrs7jquLDriqUg66eJ7Z6I6riwXHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKCdwcmV2X2hhc2gnKSl7ICAvL2hhc0NsYXNz66W8IOydtOyaqe2VmOyXrCDtgbTrnpjsiqTrqoUgcHJlduqwgCDsnojripTsp4Ag7ZmV7J24LiDsoJAg7LCN7Jy866m0IOyViOuQqFxyXG5cdFx0XHRtb3ZlU2xpZGUoY3VycmVudEluZGV4IC0gMSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRtb3ZlU2xpZGUoY3VycmVudEluZGV4ICsgMSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdFxyXG5cdGluZGljYXRvci5maW5kKCdhJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBpZHggPSAkKHRoaXMpLmluZGV4KCk7XHJcblx0XHRjb25zb2xlLmxvZyhpZHgpO1xyXG5cdFx0bW92ZVNsaWRlKGlkeCk7XHJcblx0fSk7Ly/snbjrlJTsvIDsnbTthLAg7YG066at7Jy866GcIOydtOuPme2VmOq4sFxyXG5cdFxyXG5cclxuXHRtb3ZlU2xpZGUoY3VycmVudEluZGV4KTtcclxuXHRcdFxyXG5cdFxyXG59KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiJdfQ==
