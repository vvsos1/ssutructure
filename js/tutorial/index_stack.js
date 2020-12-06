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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy90dXRvcmlhbC9pbmRleF9zdGFjay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJChmdW5jdGlvbiAoKSB7XG5cbiAgLy/rs4DsiJgg7ISg7Ja4XG5cdHZhciBjb250YWluZXIgPSAkKCcuc2xpZGVzaG93X3N0YWNrJyksXG5cdFx0c2xpZGVHcm91cCA9IGNvbnRhaW5lci5maW5kKCcuc2xpZGVzaG93LXNsaWRlc19zdGFjaycpLFxuXHRcdHNsaWRlcyA9IHNsaWRlR3JvdXAuZmluZCgnLnNsaWRlX3N0YWNrJyksXG5cdFx0bmF2ID0gY29udGFpbmVyLmZpbmQoJy5zbGlkZXNob3ctbmF2X3N0YWNrJyksXG5cdFx0aW5kaWNhdG9yID0gY29udGFpbmVyLmZpbmQoJy5zbGlkZXNob3ctaW5kaWNhdG9yX3N0YWNrJyksIFxuXHRcdHNsaWRlQ291bnQgPSBzbGlkZXMubGVuZ3RoLFxuXHRcdGluZGljYXRvckhUTUwgPScnLFxuXHRcdGN1cnJlbnRJbmRleCA9IDAsXG5cdFx0ZHVyYXRpb24gPSAnJyxcblx0XHRlYXNpbmcgPSAnZWFzZUluT3V0RXhwbyc7XG5cdFx0XG5cbiAgXG5cdHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGkpe1xuXHRcdCQodGhpcykuY3NzKHtsZWZ0OjEwMCAqIGkgKyclJ30pO1xuXHRcdGluZGljYXRvckhUTUwgKz0gJzxhIGhyZWY9XCIjXCI+JyArIChpICsgMSkgKyAnPC9hPic7XG5cdH0pO1xuXHRjb25zb2xlLmxvZyhpbmRpY2F0b3JIVE1MKTsgIFxuXHRcblx0aW5kaWNhdG9yLmh0bWwoaW5kaWNhdG9ySFRNTCk7XG5cdC8vLmh0bWwo64K07JqpKSAg64K07Jqp7J2EIGh0bWwg7ZiV7Iud7Jy866GcIOy2lOqwgCjqtZDssrQp7ZWc64ukLlxuXHQvLy50ZXh0KOuCtOyaqSkgIOuCtOyaqeydhCB0ZXh0IO2YleyLneycvOuhnCDstpTqsIAo6rWQ7LK0Ke2VnOuLpC5cblx0XG5cdC8vbW92ZVNsaWRlKCkgIOyKrOudvOydtOuTnOulvCDsnbTsoIQsIOuLpOydjCDsnbTrj5ntlZjripQg7ZWo7IiYLCDsnbjrlJTsvIDsnbTthLAuLiBcdFxuXHQvL3ZpZXdCdXR0b24oKSDtgbTrpq3tlZjrqbQg7Iqs65287J2065Oc66W8IOydtOuPmSwg7LKY7J2MLOuBneydhCDqtazrtoTtlZjsl6wg67KE7Yq87J2EIO2RnOyLnC4uXG5cdFxuXHRmdW5jdGlvbiBtb3ZlU2xpZGUoaW5kZXgpe1xuXHRcdHNsaWRlR3JvdXAuYW5pbWF0ZSh7bGVmdDogLTEwMCAqIGluZGV4ICsnJSd9LGR1cmF0aW9uLGVhc2luZyk7XG5cdFx0Y3VycmVudEluZGV4ID0gaW5kZXg7XG5cdFx0dmlld0J1dHRvbigpOyAvL+yymOydjOyduOyngCDrp4jsp4Drp4nsnbjsp4Ag6rKA7IKs7ZW07KO864qUIO2VqOyImFxuXG5cdH1cblxuXHRmdW5jdGlvbiB2aWV3QnV0dG9uKCl7ICAgIC8v67KE7Yq8IO2OmOydtOyngOyXkCDrlLDrnbwg7JWI67O07J206rKM7ZWoXG5cdFx0dmFyIG5hdlByZXYgPSBuYXYuZmluZCgnLnByZXZfc3RhY2snKSxcblx0XHRcdG5hdk5leHQgPSBuYXYuZmluZCgnLm5leHRfc3RhY2snKTtcblx0XHRcdFxuXHRcdFx0aWYoY3VycmVudEluZGV4ID09IDApeyAvL+yymOydjFxuXHRcdFx0XHRuYXZQcmV2LmFkZENsYXNzKCdkaXNhYmxlZCcpOyBcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRuYXZQcmV2LnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZihjdXJyZW50SW5kZXggPT0gc2xpZGVDb3VudCAtIDEpeyAvL+uniOyngOuniVxuXHRcdFx0XHRuYXZOZXh0LmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG5hdk5leHQucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHR9XHRcblx0XHRpbmRpY2F0b3IuZmluZCgnYScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKSBcblx0XHQuZXEoY3VycmVudEluZGV4KS5hZGRDbGFzcygnYWN0aXZlJyk7IC8vLmVxKOyIq+yekCkg7Iir7J6Q7JeQIO2VtOuLue2VmOuKlCDsmpTshowg7ISg7YOdXG5cdFx0XHRcblx0fSAvL3ZpZXdCdXR0b25cblx0XG5cdG5hdi5maW5kKCdhJykuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOyAvL+q4sOuzuOq4sOuKpSDrp4ntnojquLBcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKCdwcmV2X3N0YWNrJykpeyAgLy9oYXNDbGFzc+ulvCDsnbTsmqntlZjsl6wg7YG0656Y7Iqk66qFIHByZXbqsIAg7J6I64qU7KeAIO2ZleyduC4g7KCQIOywjeycvOuptCDslYjrkKhcblx0XHRcdG1vdmVTbGlkZShjdXJyZW50SW5kZXggLSAxKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bW92ZVNsaWRlKGN1cnJlbnRJbmRleCArIDEpO1xuXHRcdH1cblx0fSk7XG5cblx0XG5cdGluZGljYXRvci5maW5kKCdhJykuY2xpY2soZnVuY3Rpb24oKXtcblx0XHR2YXIgaWR4ID0gJCh0aGlzKS5pbmRleCgpO1xuXHRcdGNvbnNvbGUubG9nKGlkeCk7XG5cdFx0bW92ZVNsaWRlKGlkeCk7XG5cdH0pOy8v7J2465SU7LyA7J207YSwIO2BtOumreycvOuhnCDsnbTrj5ntlZjquLBcblx0XG5cblx0bW92ZVNsaWRlKGN1cnJlbnRJbmRleCk7XG5cdFx0XG5cdFxufSk7XG5cblxuXG5cblxuXG5cblxuXG5cbiJdfQ==
