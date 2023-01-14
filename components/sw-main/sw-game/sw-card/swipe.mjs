export function attachSwipeGestures(element) {
    element.addEventListener('touchmove', e => e.preventDefault());

    element.addEventListener('mousedown', lock);
    element.addEventListener('touchstart', lock);
    
    element.addEventListener('mouseup', e => move(e, element));
    element.addEventListener('touchend', e => move(e, element));
}

function swipe(e) { 
    return e.changedTouches ? e.changedTouches[0] : e;
}

let x = null, y = null;
function lock(e) {
    x = swipe(e).clientX;
    y = swipe(e).clientY;
}

function move(e, element) {
    if (x !== null && y !== null) {
        const dx = swipe(e).clientX - x;
        const dy = swipe(e).clientY - y;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) element.dispatchEvent(new Event('swipeRight'));
            if (dx < 0) element.dispatchEvent(new Event('swipeLeft'));
            x = null;
        } else if ((Math.abs(dx) < Math.abs(dy))) {
            if (dy > 0) element.dispatchEvent(new Event('swipeDown'));
            if (dy < 0) element.dispatchEvent(new Event('swipeUp'));
            y = null;
        } else {
            element.dispatchEvent(new Event('swipeNone'));
            x = null;
            y = null;
        }
    }
}

// possible to set css var!
// element.style.setProperty('--x', x += Math.sign(dx));
// element.style.setProperty('--y', y += Math.sign(dy));