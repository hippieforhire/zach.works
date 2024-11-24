function changeBackgroundColor() {
    const colors = ["#8B0000", "#FFFFFF", "#000000", "#006400", "#00008B", "#FFC0CB"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.background = randomColor;
}