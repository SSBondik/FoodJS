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
    
    function openModal() {
        modal.classList.toggle('hide');
        document.body.style.overflow = 'hidden'; //убираем скрол при открытие модального окна
        clearInterval(modalTimerId); //если пользователь открыл сам модальное окно, всплытие не произойдёт
    }

    function closeModal(){
        modal.classList.toggle('hide');
        document.body.style.overflow = '';//Востанавливаем скрол при закрытии модального окна
    }

    modalBtn.forEach(btn => {
        btn.addEventListener('click', openModal);   
         
    });

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
    //Вызываем модальное окно через 15с как пользователь зашел на сайт
    const modalTimerId = setTimeout(openModal, 15000);
    //Если пользователь долистал до конца то мы показываем ему модальное окно
    function showModalByScroll() {
        if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1){
            //Иногда появляется баг и для устранения после scrollHeight ставим -1
            openModal();
            window.removeEventListener('scroll', showModalByScroll); //после срабатывания будет удалятся
        }

        // window.scrollY - ползунок прокрутки, прокрутка по оси Y
        // document.documentElement.clientHeight - контент который сейчас видит пользователь
        // document.documentElement.scrollHeight - полную высота эл, даже то что спрятано в прокрутке
    }

    window.addEventListener('scroll', showModalByScroll);

    //Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 40;
            this.changeToUAH();
        }
        
        changeToUAH() {
            this.price = this.transfer * +this.price;
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
            <div class="menu__item">
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container'

    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню"Премиум"',
        'В меню "Премиум" мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        16,
        '.menu .container'

    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню "Постное" - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        12.7,
        '.menu .container'

    ).render();
});