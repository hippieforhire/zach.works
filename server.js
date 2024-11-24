const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const apiKey = 'YOUR_OPENAI_API_KEY'; // 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

    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: userMessage,
            max_tokens: 150,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
        });

        const botResponse = response.data.choices[0].text.trim();
        res.json({ message: botResponse });
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error);
        res.status(500).json({ error: 'Error communicating with OpenAI API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});