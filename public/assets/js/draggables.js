/*
========================================================
================== Draggable Containers ================
========================================================
 */

const FOOTER_BORDER_SIZE = 25;
const ASIDE_BORDER_SIZE = 5;
const ipcDrag = require('electron').ipcRenderer;
const dragContainer = document.querySelectorAll('.drags');
let colWidth = 7.2,
    rowHeight = 14,
    m_pos_y, m_pos_x,
    footerReferenceBaseHeight = 128,
    footerReferenceBaseMinSize = 200,
    asideReferenceBaseHeight = 128,
    asideReferenceBaseMinSize = 200;

window.onresize = function() {
    initDraggableContainers();
    resizeMainContentOnWindowResize();
}

initDraggableContainers();

/**
 * Set the draggabled HTML elements.
 * @typedef {function}
 * @memberOf MainUtils
 * @returns {void}
 */

function initDraggableContainers() {

    terminalResizer();

    let masterWindow = document.querySelector('body'),
        main = document.querySelector('#main'),
        header = document.querySelector('header'),
        footer = document.querySelector('footer'),
        leftSides = document.querySelectorAll('.leftDrag'),
        rightSides = document.querySelectorAll('.rightDrag'),
        limitLateral = 500;
        //limitLateral = window.innerWidth / 5;

        for (let i = 0; i < dragContainer.length; i++) {

        function resize(e) {

            const dy = m_pos_y - e.y,
                dx = m_pos_x - e.x,
                mainHeight = (navigator.platform === 'Win32')
                    ? window.innerHeight - (header.scrollHeight + footer.scrollHeight + 30 + 2)
                    : window.innerHeight - (header.scrollHeight + footer.scrollHeight + 2),
                sideFullHeight = (navigator.platform === 'Win32')
                    ? window.innerHeight - (header.scrollHeight + footer.scrollHeight + 40) + 10
                    : window.innerHeight - (header.scrollHeight + footer.scrollHeight) + 10;
                mainWidth = main.scrollWidth + 2;
            m_pos_y = e.y;
            m_pos_x = e.x;
            masterWindow.classList.add('selection');

            if (dragContainer[i].classList.contains('footerDrag')) {

                if (dragContainer[i].classList.contains('footer-terminal')) {
                    terminalResizer();
                }

                if (m_pos_y > window.innerHeight / 3) {

                    let height = (parseInt(getComputedStyle(dragContainer[i], '').height) + dy);
                    if (height > footerReferenceBaseMinSize) {

                        dragContainer[i].style.height = height + 'px';
                        footerReferenceBaseHeight = height;
                        main.style.height = mainHeight - footerReferenceBaseHeight + 'px';
                        for (let i = 0; i < leftSides.length; i++) {
                            let side = leftSides[i];
                            side.style.height = sideFullHeight - footerReferenceBaseHeight + 'px';
                        }
                        for (let i = 0; i < rightSides.length; i++) {
                            let side = rightSides[i];
                            side.style.height = sideFullHeight - footerReferenceBaseHeight + 'px';
                        }

                    } else {

                        dragContainer[i].style.height = footerReferenceBaseMinSize + 'px';
                        footerReferenceBaseHeight = footerReferenceBaseMinSize;
                        main.style.height = mainHeight - footerReferenceBaseHeight + 'px';
                        for (let i = 0; i < leftSides.length; i++) {
                            let side = leftSides[i];
                            side.style.height = sideFullHeight - footerReferenceBaseHeight + 'px';
                        }
                        for (let i = 0; i < rightSides.length; i++) {
                            let side = rightSides[i];
                            side.style.height = sideFullHeight - footerReferenceBaseHeight + 'px';
                        }
                    }
                }

            } else if (dragContainer[i].classList.contains('leftDrag')) {

                if (m_pos_x < limitLateral) {

                    let width = (parseInt(getComputedStyle(dragContainer[i], '').width) - dx);
                    if (width > asideReferenceBaseMinSize) {

                        dragContainer[i].style.width = width + 'px';
                        asideReferenceBaseHeight = width;
                        resizeMainContentOnDrag(dragContainer[i], width, '.rightDrag');

                    } else {

                        dragContainer[i].style.width = asideReferenceBaseMinSize + 'px';
                        asideReferenceBaseHeight = asideReferenceBaseMinSize;
                        resizeMainContentOnDrag(dragContainer[i], asideReferenceBaseMinSize, '.rightDrag');
                    }
                }

            } else if (dragContainer[i].classList.contains('rightDrag')) {

                if (m_pos_x > window.innerWidth - limitLateral) {

                    let width = (parseInt(getComputedStyle(dragContainer[i], '').width) + dx);
                    if (width > asideReferenceBaseMinSize) {

                        dragContainer[i].style.width = width + 'px';
                        asideReferenceBaseHeight = width;
                        resizeMainContentOnDrag(dragContainer[i], width, '.leftDrag');

                    } else {

                        dragContainer[i].style.width = asideReferenceBaseMinSize + 'px';
                        asideReferenceBaseHeight = asideReferenceBaseMinSize;
                        resizeMainContentOnDrag(dragContainer[i], asideReferenceBaseMinSize, '.leftDrag');
                    }
                }
            }
        }

        dragContainer[i].querySelector('.draggable-element').addEventListener("mousedown", function (e) {

            if (dragContainer[i].classList.contains('footerDrag') && e.offsetY < FOOTER_BORDER_SIZE) {
                m_pos_y = e.y;
                document.addEventListener("mousemove", resize, false);
                dragContainer[i].style.transition = 'none';
            }

            if (dragContainer[i].classList.contains('leftDrag') && e.offsetX < ASIDE_BORDER_SIZE) {
                m_pos_x = e.x;
                document.addEventListener("mousemove", resize, false);
                dragContainer[i].style.transition = 'none';
            }

            if (dragContainer[i].classList.contains('rightDrag') && e.offsetX < ASIDE_BORDER_SIZE) {
                m_pos_x = e.x;
                document.addEventListener("mousemove", resize, false);
                dragContainer[i].style.transition = 'none';
            }

        }, false);

        document.addEventListener("mouseup", function () {
            document.removeEventListener("mousemove", resize, false);
            masterWindow.classList.remove('selection');
        }, false);
    }
}

/**
 * Resize terminal dynamicaly.
 * @typedef {function}
 * @memberOf MainUtils
 * @returns {void}
 */

function terminalResizer() {

    let elmts = document.querySelectorAll('.terminals-container');

    for (let i = 0; i < elmts.length; i++) {

        let elmt = elmts[i];
        if (elmt.querySelector('.terminal')) {

            let rows = Math.floor(elmt.offsetHeight / rowHeight) - 1,
                cols = Math.floor(elmt.offsetWidth / colWidth) - 5,
                id = elmt.id;

            ipcDrag.send('terminal.resize', {'rows': rows, 'cols': cols, 'id': id});
        }
    }
}

/**
 * Resize Main content on Sides resize trigger.
 * @typedef {function}
 * @param {object} elmt - HTML resized element.
 * @param {number} elmtWidth - Element being resize dynamic width.
 * @param {string} oppositeElmts - Opposites opened elements CSS class.
 * @returns {void}
 */

function resizeMainContentOnDrag(elmt, elmtWidth, oppositeElmts) {

    let opposites = document.querySelectorAll(oppositeElmts),
        main = document.querySelector('#main'),
        mainWidth = window.innerWidth - 42,
        oppositeSize = 0;

    for (let i = 0; i < opposites.length; i++) {
        if (opposites[i].style.display === 'flex') {
            let opposit = opposites[i];
            oppositeSize = opposit.scrollWidth;
        }
    }

    if (elmt.classList.contains('leftDrag')) {
        main.style.left = elmtWidth + 20 + 'px';
    }
    main.style.width = mainWidth - elmtWidth - oppositeSize + 'px';
}

/**
 * Resize Main container on window resize event.
 * @typedef {function}
 * @memberOf MainUtils
 * @returns {void}
 */

function resizeMainContentOnWindowResize() {

    let leftDrags = document.querySelectorAll('.leftDrag'),
        rightDrags = document.querySelectorAll('.rightDrag'),
        footerDrags = document.querySelectorAll('.footerDrag'),
        main = document.querySelector('#main'),
        mainWidth = window.innerWidth - 42,
        mainHeight = (navigator.platform === 'Win32') ? window.innerHeight - 92 : window.innerHeight - 62,
        leftSize = 0,
        rightSize = 0,
        bottomSize = 0,
        allSides = [];

    for (let i = 0; i < leftDrags.length; i++) {
        allSides.push(leftDrags[i]);
        if (leftDrags[i].style.display === 'flex') {
            let leftDrag = leftDrags[i];
            leftSize = leftDrag.scrollWidth;
        }
    }

    for (let i = 0; i < rightDrags.length; i++) {
        allSides.push(rightDrags[i]);
        if (rightDrags[i].style.display === 'flex') {
            let rightDrag= rightDrags[i];
            rightSize = rightDrag.scrollWidth;
        }
    }

    for (let i = 0; i < footerDrags.length; i++) {
        if (footerDrags[i].style.display === 'flex') {
            let footerDrag = footerDrags[i];
            bottomSize = footerDrag.scrollHeight;
        }
    }

    if (leftSize > 0) {
        main.style.left = leftSize + 20 + 'px';
    }

    main.style.width = mainWidth - leftSize - rightSize + 'px';
    if (bottomSize > 0) {
        main.style.height = mainHeight - bottomSize + 'px';
        for (let i = 0; i < allSides.length; i++) {
            let side = allSides[i];
            side.style.height = mainHeight - bottomSize + 1 + 'px';
        }
    } else {
        for (let i = 0; i < allSides.length; i++) {
            let side = allSides[i];
            side.style.height = mainHeight + 2 + 'px';
        }
        main.style.height = mainHeight + 'px';
    }
}