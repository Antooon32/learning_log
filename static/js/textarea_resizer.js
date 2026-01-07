document.addEventListener('input', function (event) {
    if (event.target.classList.contains('auto-expand')) {
        autoExpand(event.target);
    }
}, false);

function autoExpand(field) {
    field.style.height = 'inherit';

    const computed = window.getComputedStyle(field);

    const lineHeight = parseInt(computed.lineHeight) || 24;
    const maxRows = 20;
    const maxHeight = lineHeight * maxRows;

    const contentHeight = field.scrollHeight;

    if (contentHeight <= maxHeight) {
        field.style.height = contentHeight + 'px';
        field.style.overflowY = 'hidden';
    } else {
        field.style.height = maxHeight + 'px';
        field.style.overflowY = 'scroll';
    }
}

window.addEventListener('load', () => {
    document.querySelectorAll('.auto-expand').forEach(autoExpand);
});