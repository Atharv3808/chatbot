let isLoading = false;

async function sendMessage() {
    if (isLoading) return;
    
    const input = document.getElementById('userInput');
    const history = document.getElementById('chatHistory');
    const status = document.getElementById('status');
    
    if (!input.value.trim()) return;
    
    // Add user message
    history.innerHTML += `
        <div class="user-message">
            <strong>You:</strong> ${input.value}
        </div>
    `;
    
    isLoading = true;
    status.style.background = '#ff9800'; // Orange
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input.value })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Add bot response
        history.innerHTML += `
            <div class="bot-message">
                <strong>Analyst:</strong> ${data.text.replace(/\n/g, '<br>')}
            </div>
        `;
    } catch (error) {
        history.innerHTML += `
            <div class="bot-message">
                <strong>Analyst:</strong> Sorry, there was an error processing your request. Please try again later.
            </div>
        `;
    } finally {
        isLoading = false;
        status.style.background = '#4CAF50'; // Green
        input.value = '';
        history.scrollTop = history.scrollHeight;
    }
}