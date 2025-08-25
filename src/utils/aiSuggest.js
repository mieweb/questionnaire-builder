export async function getSuggestedQuestions(topic) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are an expert survey creator.' },
                { role: 'user', content: `Suggest 3 good survey questions about: ${topic}` },
            ],
            max_tokens: 100,
        }),
    });
    const data = await response.json();
    // Parse the AI response into an array of questions
    return data.choices[0].message.content.split('\n').filter(q => q.trim());
}