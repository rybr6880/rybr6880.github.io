const quoteBtn = document.querySelector("#newQuoteBtn");

function getQuote() {
  console.log("Fetching a new quote...");
}

quoteBtn.addEventListener("click", getQuote);

const apiEndpoint = "https://trivia.cyberwisp.com/getrandomchristmasquestion";

async function getQuote() {
  try {
    const response = await fetch(apiEndpoint);

    if (!response.ok) {
      throw new Error(`error - status: ${response.status}`);
    }

    const data = await response.json();

    displayQuote(data.question);

    console.log(data);
  } catch (error) {
    console.error("error", error);
    alert("error" + error.message);
  }
}

function displayQuote(quoteText) {
  const quoteElement = document.querySelector("#js-quote-text");
  quoteElement.textContent = quoteText;
}

getQuote();
