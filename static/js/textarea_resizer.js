function autoExpand(field) {
    field.style.setProperty('height', 'auto', 'important');

    const computed = window.getComputedStyle(field);

    const lineHeight = parseInt(computed.lineHeight) || 24;
    const maxRows = 20;
    const maxHeight = lineHeight * maxRows;

    let newHeight = field.scrollHeight;

    if (newHeight <= maxHeight) {
        field.style.setProperty('height', newHeight + 'px', 'important');
        field.style.overflowY = 'hidden';
    } else {
        field.style.setProperty('height', maxHeight + 'px', 'important');
        field.style.overflowY = 'scroll';
    }
}

document.addEventListener('input', function (event) {
    if (event.target.classList.contains('auto-expand')) {
        autoExpand(event.target);
    }
}, false);

window.addEventListener('load', () => {
    document.querySelectorAll('.auto-expand').forEach(autoExpand);
});