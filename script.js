const wrapper = document.getElementById('envelopeWrapper');
const envelope = document.getElementById('mainEnvelope');
const letter = document.getElementById('movableLetter');

let clickState = 0; // 0=Tutup, 1=Nyembul, 2=Keluar Penuh, 3=Berputar
let isDragging = false;
let hasDragged = false; 
let startX, startY;
let currentX = 0;
let currentY = 0;

const statePositions = {
    0: 100, 
    1: -50, 
    2: -160, 
    3: -270  
};

function updateState(newState) {
    clickState = newState;
    wrapper.className = 'envelope-wrapper';
    if (clickState > 0) {
        wrapper.classList.add(`state-${clickState}`);
    }
    currentX = 0;
    
    if (clickState === 0) {
        letter.style.transform = `scale(0.5) translateY(100px)`;
        currentY = 100;
    } else {
        currentY = statePositions[clickState];
        letter.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
}

window.addEventListener('click', function(e) {
    if (hasDragged) {
        hasDragged = false;
        return;
    }

    const clickedLetter = e.target.closest('#movableLetter');
    const clickedEnvelope = e.target.closest('#mainEnvelope');

    if (clickedLetter) {
        if (clickState === 1) {
            updateState(2);
        } else if (clickState === 2) {
            updateState(3);
        } else if (clickState === 3) {
            updateState(2); 
        }
    } else if (clickedEnvelope) {
        if (clickState === 0) {
            updateState(1);
        } else {
            updateState(0);
        }
    } else {
        if (clickState > 0) updateState(0);
    }
});

function dragStart(e) {
    if (clickState === 0) return;
    
    if (e.target.closest('.scroll-content') && clickState === 3) {
        return; 
    }

    isDragging = true;
    hasDragged = false;
    letter.classList.add('dragging');

    const pageX = e.type === 'touchstart' ? e.touches[0].pageX : e.pageX;
    const pageY = e.type === 'touchstart' ? e.touches[0].pageY : e.pageY;

    startX = pageX - currentX;
    startY = pageY - currentY;
}

function dragMove(e) {
    if (!isDragging) return;
    hasDragged = true;
    e.preventDefault(); 

    const pageX = e.type === 'touchmove' ? e.touches[0].pageX : e.pageX;
    const pageY = e.type === 'touchmove' ? e.touches[0].pageY : e.pageY;

    currentX = pageX - startX;
    currentY = pageY - startY;

    letter.style.transform = `translate(${currentX}px, ${currentY}px)`;
}

function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    letter.classList.remove('dragging');
}

// PC Mouse
letter.addEventListener('mousedown', dragStart);
window.addEventListener('mousemove', dragMove);
window.addEventListener('mouseup', dragEnd);

// HP Touch
letter.addEventListener('touchstart', dragStart);
window.addEventListener('touchmove', dragMove);
window.addEventListener('touchend', dragEnd);
