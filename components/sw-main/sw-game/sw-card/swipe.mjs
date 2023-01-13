export function attachSwipeGestures(id) {
    const element = this.shadowRoot.getElementById(id);
    element.addEventListener('touchmove', e => e.preventDefault(), false);

    element.addEventListener('mousedown', lock, false);
    element.addEventListener('touchstart', lock, false);
    
    element.addEventListener('mouseup', move, false);
    element.addEventListener('touchend', move, false);
}

function swipe(e) { 
    return e.changedTouches ? e.changedTouches[0] : e;
}

let x = null, y = null;
function lock(e) {
    x = swipe(e).clientX;
    y = swipe(e).clientY;
}

function move(e) {
    if (x !== null && y !== null) {
        const dx = swipe(e).clientX - x;
        const dy = swipe(e).clientY - y;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) swipeRight(dx);
            if (dx < 0) swipeLeft(dx);
            x = null;
        } else {
            if (dy > 0) swipeDown(dy);
            if (dy < 0) swipeUp(dy);
            y = null;
        }
    }
}

function swipeLeft() {

}

function swipeRight() {

}

// possible to set css var!
// element.style.setProperty('--x', x += Math.sign(dx));
// element.style.setProperty('--y', y += Math.sign(dy));