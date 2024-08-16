// Funkcja do zapisywania odpowiedzi i przejścia do kolejnego pytania
function storeResponse(answer, questionIndex) {
    // Zapisz odpowiedź w sessionStorage
    let answers = JSON.parse(sessionStorage.getItem('answers')) || {};
    answers[`question${questionIndex}`] = answer;
    sessionStorage.setItem('answers', JSON.stringify(answers));

    console.log(`Odpowiedź na pytanie ${questionIndex} została zapisana: `, answer);

    // Przekierowanie na następną stronę lub wysyłanie odpowiedzi do bota na stronie 6
    if (questionIndex < 6) {
        window.location.href = `index${questionIndex + 1}.html`;
    } else {
        // Wywołanie funkcji wysyłania odpowiedzi do Telegrama na ostatniej stronie
        sendAllResponses();
    }
}

// Funkcja do wysyłania wszystkich odpowiedzi do bota na ostatniej stronie
function sendAllResponses() {
    let answers = JSON.parse(sessionStorage.getItem('answers'));

    if (answers) {
        let tg = window.Telegram.WebApp;
        tg.sendData(JSON.stringify(answers));
        console.log("Wszystkie odpowiedzi zostały wysłane do bota: ", answers);

        sessionStorage.removeItem('answers'); // Czyścimy odpowiedzi po wysłaniu
        tg.close(); // Zamykamy WebApp po wysłaniu danych
    } else {
        console.log("Brak odpowiedzi do wysłania.");
    }
}
