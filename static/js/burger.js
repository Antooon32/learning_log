document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('burgerToggle');
    const navContent = document.getElementById('navContent');

    toggleBtn.addEventListener('click', function() {
        toggleBtn.classList.toggle('is-active');
        navContent.classList.toggle('is-open');
        
        if (navContent.classList.contains('is-open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
});