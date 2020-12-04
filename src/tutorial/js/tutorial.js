$(function () {

  //변수 선언
	var container = $('.slideshow'),
		slideGroup = container.find('.slideshow-slides'),
		slides = slideGroup.find('.slide'),
		nav = container.find('.slideshow-nav'),
		indicator = container.find('.slideshow-indicator'), 
		slideCount = slides.length,
		indicatorHTML ='',
		currentIndex = 0,
		duration = '',
		easing = 'easeInOutExpo',
		interval = '3500',
		timer;
		

  
	slides.each(function(i){
		$(this).css({left:100 * i +'%'});
		indicatorHTML += '<a href="#">' + (i + 1) + '</a>';
	});
	console.log(indicatorHTML);  
	
	indicator.html(indicatorHTML);
	//.html(내용)  내용을 html 형식으로 추가(교체)한다.
	//.text(내용)  내용을 text 형식으로 추가(교체)한다.
	
	//goToSlide()  슬라이드를 이전, 다음 이동하는 함수, 인디케이터.. 	
	//updateNav() 클릭하면 슬라이드를 이동, 처음,끝을 구분하여 버튼을 표시..
	//startTimer() 타이머 시작(마우스가 슬라이드를 벗어났을때)
	//stopTimer() 타이머 종료(마우스가 슬라이드 위에 있을때)	
	
	function goToSlide(index){
		slideGroup.animate({left: -100 * index +'%'},duration,easing);
		currentIndex = index;
		updateNav(); //처음인지 마지막인지 검사해주는 함수

	}

	function updateNav(){    //버튼 페이지에 따라 안보이게함
		var navPrev = nav.find('.prev'),
			navNext = nav.find('.next');
			
			if(currentIndex == 0){ //처음
				navPrev.addClass('disabled'); //class명 diabled를 넣으면 사라진다 (class명 더해주는 함수)
			}else{
				navPrev.removeClass('disabled'); //class명 diabled를 빼면 생겨난다 (class명 빼주는 함수)
			}
			
			if(currentIndex == slideCount - 1){ //마지막
				navNext.addClass('disabled');
			}else{
				navNext.removeClass('disabled');
			}	
		indicator.find('a').removeClass('active') //색상
		.eq(currentIndex).addClass('active'); //.eq(숫자) 숫자에 해당하는 요소 선택
			
	} //updateNav()
	
	nav.find('a').click(function(e){
		e.preventDefault(); //기본기능 막히기
		if($(this).hasClass('prev')){  //조건문, hasClass를 이용하여 클래스명 prev가 있는지 확인. 점 찍으면 안됨
			goToSlide(currentIndex - 1);
		} else {
			goToSlide(currentIndex + 1);
		}
	});// 좌우 버튼으로 슬라이드 이동하기
	// .index()  이벤트가 일어난 요소의 순번(인덱스)번호를 반환한다.
	
	indicator.find('a').click(function(){
		var idx = $(this).index();
		console.log(idx);
		goToSlide(idx);
	});//인디케이터 클릭으로 이동하기
	

	//mouseover, mouseout,   mouseenter, mouseleave


	goToSlide(currentIndex);
		
	
});










