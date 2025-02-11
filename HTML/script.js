document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const sport = this.querySelector('h2').textContent;
            alert(`Részletek a ${sport} sportról...`);
            // Itt lehetne részletesebb információkat megjeleníteni vagy egy másik oldalra navigálni
        });
    });
});