document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".recent__item");
    const list = document.querySelector(".recent__list");

    if (!list || items.length === 0) return;

    let lastOpenedTime = 0;
    let activeItem = document.querySelector(".recent__item.is-open") || items[0];

    const setActive = (targetItem) => {
        items.forEach((item) => {
            item.classList.remove("is-open");
        });
        
        targetItem.classList.add("is-open");
        activeItem = targetItem;
        lastOpenedTime = Date.now();
    };

    items.forEach((item) => {
        item.addEventListener("mouseenter", (e) => {
            if (window.matchMedia("(pointer: fine)").matches) {
                setActive(item);
            }
        });

        item.addEventListener("click", (e) => {
            const link = e.target.closest(".recent__topic-name");
            
            if (link) {
                const isOpen = item.classList.contains("is-open");
                const timeSinceOpen = Date.now() - lastOpenedTime;

                if (!isOpen || timeSinceOpen < 400) {
                    e.preventDefault();
                    e.stopPropagation();
                    setActive(item);
                }
            }
        });
    });

    list.addEventListener("mouseleave", () => {
        if (window.matchMedia("(pointer: fine)").matches) {
            setActive(items[0]);
        }
    });
});
