window.addEventListener('DOMContentLoaded', () => {
    //Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
    
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) { //Если функция вызывается без аргумента, она по умолчанию будет подставлять 0
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if(target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //Timer

    const deadline = '2022-11-19';

    function getTimeRemaining(endtime) { //Задача ф-н получить разницу между данными
        let days,hours,minutes,seconds;
        const t = Date.parse(endtime) - Date.parse(new Date()); //получаем разницу в мс
        if(t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor( (t/(1000*60*60*24)) ); //Получаем сколько суток осталось до окончания deadLine
            hours = Math.floor( (t/(1000*60*60) % 24) );
            minutes = Math.floor( (t/1000/60) % 60);
            seconds = Math.floor( (t/1000) % 60);
        }
              

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if(num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock(); //вызываем её тут, чтобы не было багов

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);

    //Modal
    const modal = document.querySelector('.modal');
    const modalBtn = document.querySelectorAll('[data-modal]');
    const modalClose = document.querySelector('[data-close]');
    
    modalBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.toggle('hide');
            document.body.style.overflow = 'hidden'; //убираем скрол при открытие модального окна
        });     
    });

    function closeModal(){
        modal.classList.toggle('hide');
        document.body.style.overflow = '';//Востанавливаем скрол при закрытии модального окна
    }

    modalClose.addEventListener('click', closeModal);  

    modal.addEventListener('click', (e) => { //Закрытие модального окна по клику в серую область
        if(e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => { //закрытие модального окна при нажатии на клавишу Esc
        if(e.code === "Escape" && !modal.classList.contains('hide')) {
            closeModal();
        }
    });

});