/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/js/files/functions.js
let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

function addTouchClass() {
  // Добавление класса _touch для HTML, если мобильный браузер
  if (isMobile.any()) document.documentElement.classList.add('touch');
}

function menuOpen() {
  window.addEventListener("load", function () {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (!targetElement.closest(".icon-menu")) return;
      if (targetElement.closest(".icon-menu")) {
        document.documentElement.classList.toggle("menu-open");
        document.documentElement.classList.toggle("lock");
        targetElement.setAttribute("aria-label", "Открыть основное меню");
        if (document.documentElement.classList.contains("menu-open")) {
          targetElement.setAttribute("aria-label", "Закрыть основное меню");
        }
      }
    });
  });
}
// Показ шапки при скролле
function headerScroll() {
  window.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".header");
    const headerHeight = header.offsetHeight;
    let distanse = 0;
    window.addEventListener("scroll", function () {
      const windowScroll = window.scrollY;
      if (windowScroll > headerHeight) {
        if (windowScroll > distanse) {
          header.classList.add("_header-hide");
          header.classList.remove("_header-show");
        } else {
          header.classList.remove("_header-hide");
          header.classList.add("_header-show");
        }
      } else {
        header.classList.remove("_header-hide");
        header.classList.remove("_header-show");
      }
      distanse = windowScroll;
    });
  });
};

// Watcher 
function elementWatches() {
  const watchElements = document.querySelectorAll("[data-watch]");
  const observerSections = function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("_watching");
        observer.unobserve(entry.target);
      }
    });
  };
  watchElements.forEach(section => {
    let thresholdValue;
    if (section.dataset.watchThreshold) {
      thresholdValue = section.dataset.watchThreshold ? section.dataset.watchThreshold : 0;
    }
    if (section.dataset.watchParallax) {
      let parallaxValue = section.dataset.watchParallax ? section.dataset.watchParallax : 500;
      console.log(parallaxValue);
    }
    const observer = new IntersectionObserver(observerSections, {
      threshold: thresholdValue,
    });
    observer.observe(section);
  });
}
// Скролл к нужному блоку
function gotoScroll() {
  const gotoLinks = document.querySelectorAll("[data-goto]");
  if (gotoLinks.length) {
    gotoLinks.forEach(gotoLink => {
      gotoLink.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
      e.preventDefault();
      const gotoTargetLink = e.target;
      const gotoCurrentLink = gotoTargetLink.closest("[data-goto]").dataset.goto;
      if (gotoTargetLink.dataset.goto && document.querySelector(gotoTargetLink.dataset.goto)) {
        const gotoBlock = document.querySelector(gotoCurrentLink);
        const gotoLinkHeader = gotoTargetLink.hasAttribute("data-goto-header");
        const gotoLinkHeaderHeight = document.querySelector("header").offsetHeight;
        const gotoLinkOffsetTop = gotoTargetLink.hasAttribute("data-goto-top");
        const gotoLinkOffsetTopValue = gotoTargetLink.dataset.gotoTop ? gotoTargetLink.dataset.gotoTop : 0;
        let gotoTargetBlockPosition = gotoBlock.offsetTop;
        gotoTargetBlockPosition = gotoLinkHeader ? gotoTargetBlockPosition - gotoLinkHeaderHeight : gotoTargetBlockPosition;
        gotoTargetBlockPosition = gotoLinkOffsetTop ? gotoTargetBlockPosition - gotoLinkOffsetTopValue : gotoTargetBlockPosition;
        window.scrollTo({
          top: gotoTargetBlockPosition,
          behavior: "smooth",
        });
      }

      if (document.documentElement.classList.contains("menu-open")) {
        document.documentElement.classList.remove("menu-open", "lock")
      }

    };
  }
}
/*Модуль звездного рейтинга */
function formRating() {
  const ratings = document.querySelectorAll('.rating');
  if (ratings.length > 0) {
    initRatings();
  }
  // Основная функция
  function initRatings() {
    let ratingActive, ratingValue;
    // "Бегаем" по всем рейтингам на странице
    for (let index = 0; index < ratings.length; index++) {
      const rating = ratings[index];
      initRating(rating);
    }
    // Инициализируем конкретный рейтинг
    function initRating(rating) {
      initRatingVars(rating);

      setRatingActiveWidth();

      if (rating.classList.contains('rating_set')) {
        setRating(rating);
      }
    }
    // Инициализация переменных
    function initRatingVars(rating) {
      ratingActive = rating.querySelector('.rating__active');
      ratingValue = rating.querySelector('.rating__value');
    }
    // Изменяем ширину активных звезд
    function setRatingActiveWidth(index = ratingValue.innerHTML) {
      const ratingActiveWidth = index / 0.05;
      ratingActive.style.width = `${ratingActiveWidth}%`;
    }
    // Возможность указать оценку
    function setRating(rating) {
      const ratingItems = rating.querySelectorAll('.rating__item');
      for (let index = 0; index < ratingItems.length; index++) {
        const ratingItem = ratingItems[index];
        ratingItem.addEventListener("mouseenter", function (e) {
          // Обновление переменных
          initRatingVars(rating);
          // Обновление активных звезд
          setRatingActiveWidth(ratingItem.value);
        });
        ratingItem.addEventListener("mouseleave", function (e) {
          // Обновление активных звезд
          setRatingActiveWidth();
        });
        ratingItem.addEventListener("click", function (e) {
          // Обновление переменных
          initRatingVars(rating);

          if (rating.dataset.ajax) {
            // "Отправить" на сервер
            setRatingValue(ratingItem.value, rating);
          } else {
            // Отобразить указанную оценку
            ratingValue.innerHTML = index + 1;
            setRatingActiveWidth();
          }
        });
      }
    }
    async function setRatingValue(value, rating) {
      if (!rating.classList.contains('rating_sending')) {
        rating.classList.add('rating_sending');

        // // Отправка данных (value) на сервер
        // let response = await fetch('/files/product.json', {
        //   method: 'GET',

        //   body: JSON.stringify({
        //     userRating: value
        //   }),
        //   headers: {
        //     'content-type': 'application/json'
        //   }

        // });
        if (response.ok) {
          const result = await response.json();

          // Получаем новый рейтинг
          const newRating = result.newRating;

          // Вывод нового среднего результата
          ratingValue.innerHTML = newRating;

          // Обновление активных звезд
          setRatingActiveWidth();

          rating.classList.remove('rating_sending');
        } else {
          alert("Ошибка");

          rating.classList.remove('rating_sending');
        }
      }
    }
  }
}
//========================================================================================================================================================
function loopScroller() {
  const scroller = document.querySelectorAll(".scroller");
  if (scroller) {
    scroller.forEach(scrollerBlock => {
      scrollerBlock.setAttribute("data-scroll-animation", "true");
      const count = 4;  // Количество копий всех элементов
      const scrollerInner = scrollerBlock.querySelector(".scroller__inner");
      const scrollerContent = Array.from(scrollerInner.children);

      // Сначала добавляем оригинальные элементы (если они не добавлены)
      scrollerContent.forEach(contentScroller => {
        scrollerInner.append(contentScroller);
      });

      // Клонируем все элементы count раз
      for (let i = 0; i < count; i++) {
        scrollerContent.forEach(contentScroller => {
          const scrollerInnerClone = contentScroller.cloneNode(true);
          scrollerInnerClone.setAttribute("aria-hidden", "true");
          scrollerInner.append(scrollerInnerClone);
        });
      }
    });
  }
}
//========================================================================================================================================================
let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty('height') : null;
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      !showmore ? target.style.removeProperty('overflow') : null;
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // Создаем событие
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target: target
        }
      }));
    }, duration);
  }
}
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty('height') : null;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // Создаем событие
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target: target
        }
      }));
    }, duration);
  }
}
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
}
//========================================================================================================================================================
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
}
let bodyUnlock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    setTimeout(() => {
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight = '0px';
      }
      body.style.paddingRight = '0px';
      document.documentElement.classList.remove("lock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
}
let bodyLock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    for (let index = 0; index < lock_padding.length; index++) {
      const el = lock_padding[index];
      el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    }
    body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    document.documentElement.classList.add("lock");

    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
}
//========================================================================================================================================================

// Спойлеры
function spollers() {
  const spollersArray = document.querySelectorAll('[data-spollers]');
  if (spollersArray.length > 0) {
    // Событие клика
    document.addEventListener("click", setSpollerAction);
    // Получение обычных слойлеров
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    });
    // Инициализация обычных слойлеров
    if (spollersRegular.length) {
      initSpollers(spollersRegular);
    }
    // Получение слойлеров с медиа-запросами
    let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        // Событие
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    // Инициализация
    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach(spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add('_spoller-init');
          initSpollerBody(spollersBlock);
        } else {
          spollersBlock.classList.remove('_spoller-init');
          initSpollerBody(spollersBlock, false);
        }
      });
    }
    // Работа с контентом
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerItems = spollersBlock.querySelectorAll('details');
      if (spollerItems.length) {
        //spollerItems = Array.from(spollerItems).filter(item => item.closest('[data-spollers]') === spollersBlock);
        spollerItems.forEach(spollerItem => {
          let spollerTitle = spollerItem.querySelector('summary');
          if (hideSpollerBody) {
            spollerTitle.removeAttribute('tabindex');
            if (!spollerItem.hasAttribute('data-open')) {
              spollerItem.open = false;
              spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.classList.add('_spoller-active');
              spollerItem.open = true;
            }
          } else {
            spollerTitle.setAttribute('tabindex', '-1');
            spollerTitle.classList.remove('_spoller-active');
            spollerItem.open = true;
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }
    function setSpollerAction(e) {
      const el = e.target;
      if (el.closest('summary') && el.closest('[data-spollers]')) {
        e.preventDefault();
        if (el.closest('[data-spollers]').classList.contains('_spoller-init')) {
          const spollerTitle = el.closest('summary');
          const spollerBlock = spollerTitle.closest('details');
          const spollersBlock = spollerTitle.closest('[data-spollers]');
          const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
          const scrollSpoller = spollerBlock.hasAttribute('data-spoller-scroll');
          const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
          if (!spollersBlock.querySelectorAll('._slide').length) {
            if (oneSpoller && !spollerBlock.open) {
              hideSpollersBody(spollersBlock);
            }

            !spollerBlock.open ? spollerBlock.open = true : setTimeout(() => { spollerBlock.open = false }, spollerSpeed);

            spollerTitle.classList.toggle('_spoller-active');
            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);

            if (scrollSpoller && spollerTitle.classList.contains('_spoller-active')) {
              const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
              const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
              const scrollSpollerNoHeader = spollerBlock.hasAttribute('data-spoller-scroll-noheader') ? document.querySelector('.header').offsetHeight : 0;

              //setTimeout(() => {
              window.scrollTo(
                {
                  top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                  behavior: "smooth",
                }
              );
              //}, spollerSpeed);
            }
          }
        }
      }
      // Закрытие при клике вне спойлера
      if (!el.closest('[data-spollers]')) {
        const spollersClose = document.querySelectorAll('[data-spoller-close]');
        if (spollersClose.length) {
          spollersClose.forEach(spollerClose => {
            const spollersBlock = spollerClose.closest('[data-spollers]');
            const spollerCloseBlock = spollerClose.parentNode;
            if (spollersBlock.classList.contains('_spoller-init')) {
              const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
              spollerClose.classList.remove('_spoller-active');
              _slideUp(spollerClose.nextElementSibling, spollerSpeed);
              setTimeout(() => { spollerCloseBlock.open = false }, spollerSpeed);
            }
          });
        }
      }
    }
    function hideSpollersBody(spollersBlock) {
      const spollerActiveBlock = spollersBlock.querySelector('details[open]');
      if (spollerActiveBlock && !spollersBlock.querySelectorAll('._slide').length) {
        const spollerActiveTitle = spollerActiveBlock.querySelector('summary');
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
        spollerActiveTitle.classList.remove('_spoller-active');
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        setTimeout(() => { spollerActiveBlock.open = false }, spollerSpeed);
      }
    }
  }
}
//========================================================================================================================================================

// ТАБЫ
function tabs() {
  const tabs = document.querySelectorAll('[data-tabs]');
  let tabsActiveHash = [];

  if (tabs.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith('tab-')) {
      tabsActiveHash = hash.replace('tab-', '').split('-');
    }
    tabs.forEach((tabsBlock, index) => {
      tabsBlock.classList.add('_tab-init');
      tabsBlock.setAttribute('data-tabs-index', index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock);
    });

    // Получение слойлеров с медиа-запросами
    let mdQueriesArray = dataMediaQueries(tabs, "tabs");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        // Подія
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
  // Установка позиций заголовков
  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach(tabsMediaItem => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
      let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
      let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
      let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
      tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add('_tab-spoller');
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove('_tab-spoller');
        }
      });
    });
  }
  // Работа с контентом
  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
      tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
    }
    if (tabsContent.length) {
      //tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      //tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute('data-tabs-title', '');
        tabsContentItem.setAttribute('data-tabs-item', '');

        if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
          tabsTitles[index].classList.add('_tab-active');
        }
        tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
      });
    }
  }
  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    function isTabsAnamate(tabsBlock) {
      if (tabsBlock.hasAttribute('data-tabs-animate')) {
        return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
      }
    }
    const tabsBlockAnimate = isTabsAnamate(tabsBlock);
    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute('data-tabs-hash');
      tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains('_tab-active')) {
          if (tabsBlockAnimate) {
            _slideDown(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = false;
          }
          if (isHash && !tabsContentItem.closest('.popup')) {
            setHash(`tab-${tabsBlockIndex}-${index}`);
          }
        } else {
          if (tabsBlockAnimate) {
            _slideUp(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = true;
          }
        }
      });
    }
  }
  function setTabsAction(e) {
    const el = e.target;
    if (el.closest('[data-tabs-title]')) {
      const tabTitle = el.closest('[data-tabs-title]');
      const tabsBlock = tabTitle.closest('[data-tabs]');
      if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
        let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
        tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock) : null;
        tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null;
        tabTitle.classList.add('_tab-active');
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
}
//========================================================================================================================================================

// Показать еще 
function showMore() {
  window.addEventListener("load", function (e) {
    const showMoreBlocks = document.querySelectorAll('[data-showmore]');
    let showMoreBlocksRegular;
    let mdQueriesArray;
    if (showMoreBlocks.length) {
      // Получение обычных объектов
      showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (item, index, self) {
        return !item.dataset.showmoreMedia;
      });
      // Инициализация обычных объектов
      showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;

      document.addEventListener("click", showMoreActions);
      window.addEventListener("resize", showMoreActions);

      // Получение объектов с медиа-запросами
      mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
      if (mdQueriesArray && mdQueriesArray.length) {
        mdQueriesArray.forEach(mdQueriesItem => {
          // Событие
          mdQueriesItem.matchMedia.addEventListener("change", function () {
            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
        });
        initItemsMedia(mdQueriesArray);
      }
    }
    function initItemsMedia(mdQueriesArray) {
      mdQueriesArray.forEach(mdQueriesItem => {
        initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    function initItems(showMoreBlocks, matchMedia) {
      showMoreBlocks.forEach(showMoreBlock => {
        initItem(showMoreBlock, matchMedia);
      });
    }
    function initItem(showMoreBlock, matchMedia = false) {
      showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
      let showMoreContent = showMoreBlock.querySelectorAll('[data-showmore-content]');
      let showMoreButton = showMoreBlock.querySelectorAll('[data-showmore-button]');
      showMoreContent = Array.from(showMoreContent).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
      showMoreButton = Array.from(showMoreButton).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
      const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
      if (matchMedia.matches || !matchMedia) {
        if (hiddenHeight < getOriginalHeight(showMoreContent)) {
          _slideUp(showMoreContent, 0, showMoreBlock.classList.contains('_showmore-active') ? getOriginalHeight(showMoreContent) : hiddenHeight);
          showMoreButton.hidden = false;
        } else {
          _slideDown(showMoreContent, 0, hiddenHeight);
          showMoreButton.hidden = true;
        }
      } else {
        _slideDown(showMoreContent, 0, hiddenHeight);
        showMoreButton.hidden = true;
      }
    }
    function getHeight(showMoreBlock, showMoreContent) {
      let hiddenHeight = 0;
      const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : 'size';
      const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) ? parseFloat(getComputedStyle(showMoreContent).rowGap) : 0;
      if (showMoreType === 'items') {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
        const showMoreItems = showMoreContent.children;
        for (let index = 1; index < showMoreItems.length; index++) {
          const showMoreItem = showMoreItems[index - 1];
          const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop) ? parseFloat(getComputedStyle(showMoreItem).marginTop) : 0;
          const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) ? parseFloat(getComputedStyle(showMoreItem).marginBottom) : 0;
          hiddenHeight += showMoreItem.offsetHeight + marginTop;
          if (index == showMoreTypeValue) break;
          hiddenHeight += marginBottom;
        }
        rowGap ? hiddenHeight += (showMoreTypeValue - 1) * rowGap : null;
      } else {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
        hiddenHeight = showMoreTypeValue;
      }
      return hiddenHeight;
    }

    function getOriginalHeight(showMoreContent) {
      let parentHidden;
      let hiddenHeight = showMoreContent.offsetHeight;
      showMoreContent.style.removeProperty('height');
      if (showMoreContent.closest(`[hidden]`)) {
        parentHidden = showMoreContent.closest(`[hidden]`);
        parentHidden.hidden = false;
      }
      let originalHeight = showMoreContent.offsetHeight;
      parentHidden ? parentHidden.hidden = true : null;
      showMoreContent.style.height = `${hiddenHeight}px`;
      return originalHeight;
    }
    function showMoreActions(e) {
      const targetEvent = e.target;
      const targetType = e.type;
      if (targetType === 'click') {
        if (targetEvent.closest('[data-showmore-button]')) {
          const showMoreButton = targetEvent.closest('[data-showmore-button]');
          const showMoreBlock = showMoreButton.closest('[data-showmore]');
          const showMoreContent = showMoreBlock.querySelector('[data-showmore-content]');
          const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : '500';
          const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
          if (!showMoreContent.classList.contains('_slide')) {
            showMoreBlock.classList.contains('_showmore-active') ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
            showMoreBlock.classList.toggle('_showmore-active');
          }
        }
      } else if (targetType === 'resize') {
        showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
        mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
      }
    }
  });
}
//========================================================================================================================================================

function dataMediaQueries(array, dataSetValue) {
  // Получение объектов с медиа-запросами
  const media = Array.from(array).filter(function (item, index, self) {
    if (item.dataset[dataSetValue]) {
      return item.dataset[dataSetValue].split(",")[0];
    }
  });
  // Инициализация объектов с медиа-запросами
  if (media.length) {
    const breakpointsArray = [];
    media.forEach(item => {
      const params = item.dataset[dataSetValue];
      const breakpoint = {};
      const paramsArray = params.split(",");
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });
    // Получаем уникальные брейкпоинты
    let mdQueries = breakpointsArray.map(function (item) {
      return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
    });
    mdQueries = uniqArray(mdQueries);
    const mdQueriesArray = [];

    if (mdQueries.length) {
      // Работаем с каждым брейкпоинтом
      mdQueries.forEach(breakpoint => {
        const paramsArray = breakpoint.split(",");
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);
        // Объекты с необходимыми условиями
        const itemsArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });
        mdQueriesArray.push({
          itemsArray,
          matchMedia
        })
      });
      return mdQueriesArray;
    }
  }
}
;// CONCATENATED MODULE: ./src/js/files/modules.js
const modules_flsModules = {};
;// CONCATENATED MODULE: ./src/js/files/forms.js
// export function formSubmit() {
//   const forms = document.forms;
//   if (forms.length) {
//     for (const form of forms) {
//       // form.addEventListener("submit", formSend);
//       form.addEventListener("submit", function (e) {
//         const form = e.target;
//         formSubmitActions(form, e);
//       });
//     }
//   }
//   async function formSubmitActions(form, e) {
//     e.preventDefault();
//     const error = formValidate(form);

// import { flsModules } from "./modules.js";

//     let formData = new FormData(form);

//     // if (error === 0) {
//     //   let response = await fetch("./files/sendmail.php", {
//     //     method: "POST",
//     //     body: formData,
//     //   });
//     //   if (response.ok) {
//     //     let result = await response.json();
//     //     alert(result.message);
//     //     form.reset();
//     //     console.log("response ok");
//     //   }
//     // }
//   }
//   function formValidate(form) {
//     let error = 0;
//     const formRequired = form.querySelectorAll("[data-required]");
//     if (formRequired.length) {
//       formRequired.forEach(input => {
//         if (input.dataset.required === "email") {
//           if (emailTest(input)) {
//             formAddError(input);
//             error++;
//           }
//         } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
//           formAddError(input);
//           error++;
//         } else {
//           if (input.value === "") {
//             formAddError(input);
//             error++;
//           } else {
//             formRemoveError(input);
//           }
//         }
//       });
//     }
//     return error;
//   }
//   function formAddError(input) {
//     input.parentElement.classList.add("_form-error");
//     input.classList.add("_form-error");
//     const inputError = input.parentElement.querySelector(".form-error");
//     if (inputError) input.parentElement.removeChild(inputError);
//     if (input.dataset.error) {
//       input.parentElement.insertAdjacentHTML("beforeend", `<div class="form-error">${input.dataset.error}</div>`)
//     }

//   }
//   function formRemoveError(input) {
//     input.parentElement.classList.remove("_form-error");
//     input.classList.remove("_form-error");
//     if (input.parentElement.querySelector(".form-error")) {
//       input.parentElement.removeChild(input.parentElement.querySelector(".form-error"));
//     }
//   }
//   function emailTest(input) {
//     return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
//   }
//   function formsFieldinit() {
//     document.body.addEventListener("focusin", function (e) {
//       const targetElement = e.target;
//       if (targetElement.tagName === "INPUT") {
//         formRemoveError(targetElement);
//         console.log("Фокус на инпуте");
//       }
//     });
//   }
// }



function formsFieldsInit(options = { viewpass: false, maskTel: false, valid: false }) {
  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
      targetElement.parentElement.classList.add("_form-focus");
      targetElement.classList.add("_form-focus");
      formValidate.removeErrorClass(targetElement);
      formValidate.errorRemoveBlock(targetElement);
    }
  });
  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
      targetElement.parentElement.classList.remove("_form-focus");
      targetElement.classList.remove("_form-focus");
    }
    targetElement.hasAttribute("data-validate") ? formValidate.validateInput(targetElement) : null;
    // setTimeout(function () {
    //   if (targetElement.value.length === 0) {
    //     formValidate.removeErrorClass(targetElement);
    //     formValidate.errorRemoveBlock(targetElement);
    //   }
    // }, 5000);
  });
  if (options.viewpass) {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (targetElement.closest(`[class*="__viewpass"]`)) {
        let inputPasswordType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
        targetElement.parentElement.querySelector("input").setAttribute("type", inputPasswordType);
        targetElement.classList.toggle("_viewpass-active");
      }
    });
  }
  if (options.maskTel) {
    const phoneInput = document.querySelectorAll("[data-tel-input]");
    if (phoneInput) {
      phoneInput.forEach(input => {
        input.addEventListener("input", onPhoneInput);
        input.addEventListener("keydown", onPhoneKeyDown);
        input.addEventListener("paste", onPhonePaste);
        input.addEventListener("focusin", onInputFocus);
        input.addEventListener("focusout", onInputFocusOut);
      });
    }
    function onPhoneInput(e) {
      const input = e.target;
      let inputNumbersValue = getInputNumbersValue(input);
      let formattedInputValue = "";
      let selecitonStart = input.selectionStart;
      if (!inputNumbersValue) {
        return input.value = "";
      }
      if (input.value.length != selecitonStart) {
        if (e.data && /\D/g.test(e.data)) {
          input.value = inputNumbersValue;
        }
        return;
      }
      if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
        input.setAttribute("maxlength", "18");
        // Русский номер телефона
        if (inputNumbersValue[0] == "8") {
          input.setAttribute("maxlength", "17");
        }
        if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
        let firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
        formattedInputValue = firstSymbols + " ";
        if (inputNumbersValue.length > 1) {
          formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
          formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
          formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
          formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
        }
      } else {
        input.setAttribute("maxlength", "12");
        // НЕ Русский номер телефона
        formattedInputValue = "+" + inputNumbersValue.substring(0, 11);
      }
      input.value = formattedInputValue;
    }
    function getInputNumbersValue(input) {
      return input.value.replace(/\D/g, "");
    };
    function onPhoneKeyDown(e) {
      const input = e.target;
      if (e.keyCode == 8 && getInputNumbersValue(input).length == 1) {
        input.value = "";
        if (input.hasAttribute("data-input-valid")) {
          formValidate.removeValidClass(input);
          formValidate.removeErrorClass(input);
        }
      }
    };
    function onPhonePaste(e) {
      const pasted = e.clipboardData || window.Clipboard;
      const input = e.target;
      const inputNumbersValue = getInputNumbersValue(input);
      if (pasted) {
        const pastedText = pasted.getData("Text");
        if (/\D/g.test(pastedText)) {
          input.value = inputNumbersValue;
        }
      };
    };
    function onInputFocus(e) {
      const input = e.target;
      if (input.dataset.inputLabel) {
        input.parentElement.insertAdjacentHTML("beforeend", `<div class="form__label-block">${input.dataset.inputLabel}</div>`);
      }
    };
    function onInputFocusOut(e) {
      const input = e.target;
      if (input.parentElement.querySelector('.form__label-block')) {
        input.parentElement.removeChild(input.parentElement.querySelector('.form__label-block'));
      }
    };
  }
  // if (options.valid) {
  //   const inputValid = document.querySelectorAll("[data-input-valid]");
  //   if (inputValid) {
  //     inputValid.forEach(inputValidEl => {
  //       inputValidEl.addEventListener("input", function () {
  //         if (inputValidEl.value !== "") {
  //           inputValidEl.classList.add("_input-valid", "_input-valid-success");
  //         } else {
  //           inputValidEl.classList.remove("_input-valid", "_input-valid-success");
  //           formValidate.removeErrorClass(inputValidEl);
  //         }

  //         if (inputValidEl.hasAttribute("data-min-length")) {
  //           const inputMinLength = inputValidEl.dataset.minLength;
  //           if (inputValidEl.value.length < inputMinLength) {
  //             inputValidEl.classList.remove("_input-valid-success");
  //             formValidate.addErrorClass(inputValidEl);
  //             if (inputValidEl.value == "") {
  //               formValidate.removeErrorClass(inputValidEl);
  //             }
  //           } else {
  //             inputValidEl.classList.add("_input-valid-success");
  //             formValidate.removeErrorClass(inputValidEl);
  //           }
  //         }

  //         if (inputValidEl.hasAttribute("data-tel-input")) {
  //           const inputPhoneMask = inputValidEl.getAttribute("maxlength");
  //           if (inputValidEl.value.length < inputPhoneMask) {
  //             inputValidEl.classList.remove("_input-valid-success");
  //             formValidate.addErrorClass(inputValidEl);
  //             if (inputValidEl.value.length == 0) {
  //               formValidate.removeErrorClass(inputValidEl);
  //             }
  //           } else {
  //             inputValidEl.classList.add("_input-valid-success");
  //             formValidate.removeErrorClass(inputValidEl);
  //           }
  //         }
  //       })

  //     })
  //   }
  // }

  if (options.valid) {
    const inputValid = document.querySelectorAll("[data-input-valid]");
    if (inputValid) {
      inputValid.forEach(inputValidEl => {
        inputValidEl.addEventListener("input", function () {
          if (inputValidEl.value !== "") {
            formValidate.addValidClass(inputValidEl);
            formValidate.addValidSuccessClass(inputValidEl);
          } else {
            formValidate.removeErrorClass(inputValidEl);
            formValidate.removeValidClass(inputValidEl);
            formValidate.removeValidSuccessClass(inputValidEl);
          }

          if (inputValidEl.hasAttribute("data-min-length")) {
            const inputMinLength = inputValidEl.dataset.minLength;
            if (inputValidEl.value.length < inputMinLength) {
              formValidate.removeValidSuccessClass(inputValidEl);
              formValidate.addErrorClass(inputValidEl);
              if (inputValidEl.value == "") {
                formValidate.removeErrorClass(inputValidEl);
              }
            } else {
              formValidate.addValidSuccessClass(inputValidEl);
              formValidate.removeErrorClass(inputValidEl);
            }
          }

          if (inputValidEl.hasAttribute("data-max-length")) {
            const inputMaxLength = inputValidEl.dataset.maxLength;
            if (inputValidEl.value.length > inputMaxLength) {
              formValidate.removeValidSuccessClass(inputValidEl);
              formValidate.addErrorClass(inputValidEl);
            } else {
              formValidate.addValidSuccessClass(inputValidEl);
              formValidate.removeErrorClass(inputValidEl);
              formValidate.addValidClass(inputValidEl);
            }
            if (inputValidEl.value == '') {
              formValidate.removeValidClass(inputValidEl);
              formValidate.removeValidSuccessClass(inputValidEl);
            }
          }

          if (inputValidEl.hasAttribute("data-tel-input")) {
            const inputPhoneMask = inputValidEl.getAttribute("maxlength");
            if (inputValidEl.value.length < inputPhoneMask) {
              formValidate.removeValidSuccessClass(inputValidEl);
              formValidate.addErrorClass(inputValidEl);
              if (inputValidEl.value == "") {
                formValidate.removeErrorClass(inputValidEl);
              }
            } else {
              inputValidEl.classList.add("_input-valid-success");
              formValidate.removeErrorClass(inputValidEl);
            }
          }
        })

      })
    }
  }

};
let formValidate = {
  getErrors(form) {
    let error = 0;
    const formRequired = form.querySelectorAll("[data-required]");
    formRequired.forEach(input => {
      error += this.validateInput(input);
    });
    return error;
  },
  validateInput(input) {
    let error = 0;
    if (input.dataset.required === "tel") {
      if (input.value.length < input.getAttribute("maxlength")) {
        formValidate.errorAddBlock(input, `Введите корректный номер телефона`);
        formValidate.addErrorClass(input);
        error++;
      }
    }
    if (input.dataset.maxLength) {
      if (input.value.length > input.dataset.maxLength) {
        formValidate.errorAddBlock(input, `Максимальное количество символов ${input.dataset.maxLength}`);
        formValidate.addErrorClass(input);
        error++;
      }
    }
    if (input.dataset.minLength) {
      if (input.value.length < input.dataset.minLength) {
        formValidate.errorAddBlock(input, `Минимальное количество символов ${input.dataset.minLength}`);
        formValidate.addErrorClass(input);
        error++;
      }
    }
    if (input.dataset.required === "email") {
      if (formValidate.emailTest(input)) {
        formValidate.errorAddBlock(input, `Введите корректный email`);
        formValidate.addErrorClass(input);
        error++;
      }
    } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
      formValidate.addErrorClass(input);
      error++;
    }
    if (input.value === "") {
      formValidate.errorAddBlock(input, "Заполните это поле");
      formValidate.addErrorClass(input);
      error++;
    }
    return error;
  },
  addErrorClass(input) {
    input.parentElement.classList.add("_form-error");
    input.classList.add("_form-error");
  },
  removeErrorClass(input) {
    input.parentElement.classList.remove("_form-error");
    input.classList.remove("_form-error");
  },
  emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  },
  errorAddBlock(input, text) {
    const errorBlock = input.parentElement.querySelector(".input-error");
    if (errorBlock) input.parentElement.removeChild(errorBlock);
    input.parentElement.insertAdjacentHTML("beforeend", `<div class="input-error">${text}</div>`)
  },
  errorRemoveBlock(input) {
    if (input.parentElement.querySelector(".input-error")) {
      input.parentElement.removeChild(input.parentElement.querySelector(".input-error"));
    }
  },
  addValidClass(input) {
    input.classList.add("_input-valid");
  },
  removeValidClass(input) {
    input.classList.remove("_input-valid");
  },
  addValidSuccessClass(input) {
    input.classList.add("_input-valid-success");
  },
  removeValidSuccessClass(input) {
    input.classList.remove("_input-valid-success");
  },
}
function formSubmit() {
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener("submit", function (e) {
        const form = e.target;
        formSubmitActions(form, e);
      });
    }
  }
  async function formSubmitActions(form, e) {
    const error = formValidate.getErrors(form);
    if (error === 0) {
      const ajax = form.hasAttribute("data-ajax");
      if (ajax) {
        e.preventDefault();
        const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
        const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
        const formData = new FormData(form);

        form.classList.add("_sending");

        const response = await fetch(formAction, {
          method: formMethod,
          body: formData
        });
        if (response.ok) {
          // let responseResult = await response.json();
          formSent(form);
          form.classList.remove("_sending");
        } else {
          form.setAttribute("data-response-error", "#response-error");
          if (flsModules.popup) {
            const popup = form.dataset.responseError;
            popup ? flsModules.popup.open(popup) : null;
          };
          form.removeAttribute("data-response-error");
          form.classList.remove("_sending");
        }
      } else if (form.hasAttribute("data-dev")) {
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
    }
  }

  function formSent(form, responseResult = '') {
    document.dispatchEvent(new CustomEvent("formSent", {
      detail: {
        form: form
      }
    }));
    if (flsModules.popup) {
      const popup = form.dataset.popupMessage;
      popup ? flsModules.popup.open(popup) : null;
    }
    form.reset();
  };
}

;// CONCATENATED MODULE: ./src/js/files/mouse-block.js
document.addEventListener("mousemove", function (e) {
  document.body.style.cssText = `
    --move-x: ${e.clientX}px;
    --move-y: ${e.clientY}px;
  `;
});



;// CONCATENATED MODULE: ./src/js/app.js


// myFunctions.addTouchClass();
// Бургер меню
// myFunctions.menuOpen();
//========================================================================================================================================================

// показ шапки при скролле
// myFunctions.headerScroll();

//========================================================================================================================================================
// Wathcer
// myFunctions.elementWatches();
//========================================================================================================================================================

// Скролл к нужному блоку
// myFunctions.gotoScroll();
//
//========================================================================================================================================================

// Табы
// myFunctions.tabs();
//========================================================================================================================================================

// Spollers
// myFunctions.spollers();

//========================================================================================================================================================
// Scroller
// myFunctions.loopScroller();

//========================================================================================================================================================

// Звездный рейтинг
// myFunctions.formRating();
//========================================================================================================================================================
// import "./libs/popup.js";

//====Показать еще ====================================================================================================================================================
// myFunctions.showMore();

//========================================================================================================================================================



// formsSettings.formsFieldsInit({
//   viewpass: false,
//   maskTel: false,
//   valid: false,
// });

// Отправка формы
// formsSettings.formSubmit();

// import "./files/select.js";
//========================================================================================================================================================

// Подключение Range Slider --------------------------------------------------------------
// Документация https://refreshless.com/nouislider/
// import "./files/range.js";
//========================================================================================================================================================
// Слайдер свайпер
// import "./files/swiper.js";


// Динамический адаптив
// import "./libs/dynamic_adapt.js";


/******/ })()
;