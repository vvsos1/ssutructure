(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
$(function () {

  //변수 선언
	var container = $('.slideshow_tree'),
		slideGroup = container.find('.slideshow-slides_tree'),
		slides = slideGroup.find('.slide_tree'),
		nav = container.find('.slideshow-nav_tree'),
		indicator = container.find('.slideshow-indicator_tree'), 
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
		var navPrev = nav.find('.prev_tree'),
			navNext = nav.find('.next_tree');
			
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
		if($(this).hasClass('prev_tree')){  //hasClass를 이용하여 클래스명 prev가 있는지 확인. 점 찍으면 안됨
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy90dXRvcmlhbC9pbmRleF90cmVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIkKGZ1bmN0aW9uICgpIHtcblxuICAvL+uzgOyImCDshKDslrhcblx0dmFyIGNvbnRhaW5lciA9ICQoJy5zbGlkZXNob3dfdHJlZScpLFxuXHRcdHNsaWRlR3JvdXAgPSBjb250YWluZXIuZmluZCgnLnNsaWRlc2hvdy1zbGlkZXNfdHJlZScpLFxuXHRcdHNsaWRlcyA9IHNsaWRlR3JvdXAuZmluZCgnLnNsaWRlX3RyZWUnKSxcblx0XHRuYXYgPSBjb250YWluZXIuZmluZCgnLnNsaWRlc2hvdy1uYXZfdHJlZScpLFxuXHRcdGluZGljYXRvciA9IGNvbnRhaW5lci5maW5kKCcuc2xpZGVzaG93LWluZGljYXRvcl90cmVlJyksIFxuXHRcdHNsaWRlQ291bnQgPSBzbGlkZXMubGVuZ3RoLFxuXHRcdGluZGljYXRvckhUTUwgPScnLFxuXHRcdGN1cnJlbnRJbmRleCA9IDAsXG5cdFx0ZHVyYXRpb24gPSAnJyxcblx0XHRlYXNpbmcgPSAnZWFzZUluT3V0RXhwbyc7XG5cdFx0XG5cbiAgXG5cdHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGkpe1xuXHRcdCQodGhpcykuY3NzKHtsZWZ0OjEwMCAqIGkgKyclJ30pO1xuXHRcdGluZGljYXRvckhUTUwgKz0gJzxhIGhyZWY9XCIjXCI+JyArIChpICsgMSkgKyAnPC9hPic7XG5cdH0pO1xuXHRjb25zb2xlLmxvZyhpbmRpY2F0b3JIVE1MKTsgIFxuXHRcblx0aW5kaWNhdG9yLmh0bWwoaW5kaWNhdG9ySFRNTCk7XG5cdC8vLmh0bWwo64K07JqpKSAg64K07Jqp7J2EIGh0bWwg7ZiV7Iud7Jy866GcIOy2lOqwgCjqtZDssrQp7ZWc64ukLlxuXHQvLy50ZXh0KOuCtOyaqSkgIOuCtOyaqeydhCB0ZXh0IO2YleyLneycvOuhnCDstpTqsIAo6rWQ7LK0Ke2VnOuLpC5cblx0XG5cdC8vbW92ZVNsaWRlKCkgIOyKrOudvOydtOuTnOulvCDsnbTsoIQsIOuLpOydjCDsnbTrj5ntlZjripQg7ZWo7IiYLCDsnbjrlJTsvIDsnbTthLAuLiBcdFxuXHQvL3ZpZXdCdXR0b24oKSDtgbTrpq3tlZjrqbQg7Iqs65287J2065Oc66W8IOydtOuPmSwg7LKY7J2MLOuBneydhCDqtazrtoTtlZjsl6wg67KE7Yq87J2EIO2RnOyLnC4uXG5cdFxuXHRmdW5jdGlvbiBtb3ZlU2xpZGUoaW5kZXgpe1xuXHRcdHNsaWRlR3JvdXAuYW5pbWF0ZSh7bGVmdDogLTEwMCAqIGluZGV4ICsnJSd9LGR1cmF0aW9uLGVhc2luZyk7XG5cdFx0Y3VycmVudEluZGV4ID0gaW5kZXg7XG5cdFx0dmlld0J1dHRvbigpOyAvL+yymOydjOyduOyngCDrp4jsp4Drp4nsnbjsp4Ag6rKA7IKs7ZW07KO864qUIO2VqOyImFxuXG5cdH1cblxuXHRmdW5jdGlvbiB2aWV3QnV0dG9uKCl7ICAgIC8v67KE7Yq8IO2OmOydtOyngOyXkCDrlLDrnbwg7JWI67O07J206rKM7ZWoXG5cdFx0dmFyIG5hdlByZXYgPSBuYXYuZmluZCgnLnByZXZfdHJlZScpLFxuXHRcdFx0bmF2TmV4dCA9IG5hdi5maW5kKCcubmV4dF90cmVlJyk7XG5cdFx0XHRcblx0XHRcdGlmKGN1cnJlbnRJbmRleCA9PSAwKXsgLy/sspjsnYxcblx0XHRcdFx0bmF2UHJldi5hZGRDbGFzcygnZGlzYWJsZWQnKTsgXG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0bmF2UHJldi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYoY3VycmVudEluZGV4ID09IHNsaWRlQ291bnQgLSAxKXsgLy/rp4jsp4Drp4lcblx0XHRcdFx0bmF2TmV4dC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRuYXZOZXh0LnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0fVx0XG5cdFx0aW5kaWNhdG9yLmZpbmQoJ2EnKS5yZW1vdmVDbGFzcygnYWN0aXZlJykgXG5cdFx0LmVxKGN1cnJlbnRJbmRleCkuYWRkQ2xhc3MoJ2FjdGl2ZScpOyAvLy5lcSjsiKvsnpApIOyIq+yekOyXkCDtlbTri7ntlZjripQg7JqU7IaMIOyEoO2DnVxuXHRcdFx0XG5cdH0gLy92aWV3QnV0dG9uXG5cdFxuXHRuYXYuZmluZCgnYScpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGUucHJldmVudERlZmF1bHQoKTsgLy/quLDrs7jquLDriqUg66eJ7Z6I6riwXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcygncHJldl90cmVlJykpeyAgLy9oYXNDbGFzc+ulvCDsnbTsmqntlZjsl6wg7YG0656Y7Iqk66qFIHByZXbqsIAg7J6I64qU7KeAIO2ZleyduC4g7KCQIOywjeycvOuptCDslYjrkKhcblx0XHRcdG1vdmVTbGlkZShjdXJyZW50SW5kZXggLSAxKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bW92ZVNsaWRlKGN1cnJlbnRJbmRleCArIDEpO1xuXHRcdH1cblx0fSk7XG5cblx0XG5cdGluZGljYXRvci5maW5kKCdhJykuY2xpY2soZnVuY3Rpb24oKXtcblx0XHR2YXIgaWR4ID0gJCh0aGlzKS5pbmRleCgpO1xuXHRcdGNvbnNvbGUubG9nKGlkeCk7XG5cdFx0bW92ZVNsaWRlKGlkeCk7XG5cdH0pOy8v7J2465SU7LyA7J207YSwIO2BtOumreycvOuhnCDsnbTrj5ntlZjquLBcblx0XG5cblx0bW92ZVNsaWRlKGN1cnJlbnRJbmRleCk7XG5cdFx0XG5cdFxufSk7XG5cblxuXG5cblxuXG5cblxuXG5cbiJdfQ==
