function addClickListener(elements, groupClass) {
    elements.forEach(element => {
        element.addEventListener('click', () => {
            // Remove 'active' class from all elements in the same group
            document.querySelectorAll(`.${groupClass} a`).forEach(elem => {
                elem.classList.remove('active');
            });

            // Add 'active' class to the clicked element
            element.classList.add('active');
        });
    });
}

// Apply the click listener to each group separately
addClickListener(document.querySelectorAll('.navbar a'), 'navbar');
addClickListener(document.querySelectorAll('.tabs a'), 'tabs');
addClickListener(document.querySelectorAll('.header a'), 'header');
