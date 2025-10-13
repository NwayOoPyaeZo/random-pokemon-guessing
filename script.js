// Select the button and paragraph elements by their IDs
const button = document.getElementById("clickBtn");
const message = document.getElementById("message");

// Add a click event listener to the button
button.addEventListener("click", () => {
  // Change the text inside the paragraph when the button is clicked
  message.textContent = "You clicked the button! JavaScript is working.";

  // Change the button’s color temporarily for feedback
  button.style.backgroundColor = "#00cc66";

  // Revert the button color back after 1 second
  setTimeout(() => {
    button.style.backgroundColor = "#0077cc";
  }, 1000);
});