// Function to shuffle array except elements with class "no-shuffle"
function shuffleArray(array) {
    let shuffableArray = [];
    let fixedArray = [];
    let resultArray = [];

    // Separate elements with and without the "no-shuffle" class, and keep track of their original indices
    array.forEach((item) => {
        if (item.classList.contains('no-shuffle')) {
            fixedArray.push(item);
        } else {
            shuffableArray.push(item);
        }
    });

    // Shuffle the shuffableArray
    for (let i = shuffableArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffableArray[i], shuffableArray[j]] = [shuffableArray[j], shuffableArray[i]];
    }

    // Result array, with the shuffeled ones comming first
    resultArray = [...shuffableArray, ...fixedArray];

    return resultArray;
}

// Shuffle team members on page reload
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('teamContainerShuffel');
    const itemsArray = Array.from(container.children);

    const resultArray = shuffleArray(itemsArray);

    // Clear the container
    container.innerHTML = '';

    // Reattach the sorted elements
    resultArray.forEach(item => container.appendChild(item));
});