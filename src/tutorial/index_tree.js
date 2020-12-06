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










