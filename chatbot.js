document.addEventListener("DOMContentLoaded", function() {
    function openModal(modalId) {
        document.getElementById(modalId).style.display = "block";
        if (modalId === 'flappyBirdModal') startGame();
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = "none";
        if (modalId === 'flappyBirdModal') stopGame();
    }

    function closeModalOnOutsideClick(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    }

    function showZorkGame() {
        document.getElementById("zorkGame").style.display = "block";
        document.getElementById("hideZorkButton").style.display = "block";
        document.getElementById("showZorkButton").style.display = "none";
        startZorkGame();
    }

    function hideZorkGame() {
        document.getElementById("zorkGame").style.display = "none";
        document.getElementById("hideZorkButton").style.display = "none";
        document.getElementById("showZorkButton").style.display = "block";
    }

    function showChatbot() {
        document.getElementById("chatbox").style.display = "block";
        document.getElementById("showChatbotButton").style.display = "none";
        document.getElementById("hideChatbotButton").style.display = "block";
    }

    function hideChatbot() {
        document.getElementById("chatbox").style.display = "none";
        document.getElementById("hideChatbotButton").style.display = "none";
        document.getElementById("showChatbotButton").style.display = "block";
    }

    setInterval(() => {
        const now = new Date();
        const time = now.toLocaleTimeString();
        document.getElementById("clock").textContent = time;
    }, 1000);

    async function sendMessage() {
        const inputBox = document.getElementById('user-input');
        const message = inputBox.value;
        if (!message) return;

        const messagesDiv = document.getElementById('messages');
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.textContent = message;
        messagesDiv.appendChild(userMessageDiv);

        inputBox.value = '';

        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot-message';
        botMessageDiv.textContent = data.message;
        messagesDiv.appendChild(botMessageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    window.sendMessage = sendMessage;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.closeModalOnOutsideClick = closeModalOnOutsideClick;
    window.showZorkGame = showZorkGame;
    window.hideZorkGame = hideZorkGame;
    window.showChatbot = showChatbot;
    window.hideChatbot = hideChatbot;
});
