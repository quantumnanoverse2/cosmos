import './style.css';
import { marked } from 'marked';

const API_KEY = "sk-f772ce1172784c539d63d576010ddc7a";
const API_URL = "/api/chat/completions";
// We'll use the DeepSeek Chat model
const MODEL = "deepseek-chat";

const chatForm = document.getElementById('chat-form');
const promptInput = document.getElementById('prompt-input');
const chatHistory = document.getElementById('chat-history');

// Chat history array to maintain context
let messages = [
  { role: "system", content: "You are a lightning fast brainstorming partner. You provide creative, concise, and incredibly helpful ideas. Format your output with markdown if helpful, but keep it brief and punchy. DO NOT output any internal thinking processes, thought chains, or scratchpads. Output ONLY your final response to the user." }
];

// Auto-resize textarea
promptInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
});

// Handle Enter key (shift+enter for new line)
promptInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (this.value.trim() !== '') {
      chatForm.dispatchEvent(new Event('submit'));
    }
  }
});

function appendMessage(role, content, isMarkdown = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role === 'user' ? 'user-message' : 'system-message'}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content markdown-body';
  
  if (isMarkdown) {
    contentDiv.innerHTML = marked.parse(content);
  } else {
    contentDiv.textContent = content;
  }
  
  msgDiv.appendChild(contentDiv);
  chatHistory.appendChild(msgDiv);
  
  // Scroll to bottom
  chatHistory.parentElement.scrollTop = chatHistory.parentElement.scrollHeight;
  return contentDiv;
}

// Function to call API with retry logic
async function fetchWithRetry(url, options, maxRetries = 3) {
  let attempt = 0;
  let delayMs = 1000;
  
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      attempt++;
      console.warn(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt >= maxRetries) {
        throw error;
      }
      // Wait before retrying
      await new Promise(res => setTimeout(res, delayMs));
      delayMs *= 2; // Exponential backoff
    }
  }
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userText = promptInput.value.trim();
  if (!userText) return;
  
  // Reset input
  promptInput.value = '';
  promptInput.style.height = 'auto';
  
  // Append user message (plain text)
  appendMessage('user', userText, false);
  messages.push({ role: 'user', content: userText });
  
  // Prevent context from growing too large and causing 413 Payload Too Large
  // Keep the system prompt (index 0) and the last 10 messages
  if (messages.length > 11) {
    messages = [messages[0], ...messages.slice(-10)];
  }
  
  // Create loading element
  const aiMsgDiv = document.createElement('div');
  aiMsgDiv.className = 'message system-message';
  const aiContentDiv = document.createElement('div');
  aiContentDiv.className = 'message-content loading';
  aiMsgDiv.appendChild(aiContentDiv);
  chatHistory.appendChild(aiMsgDiv);
  chatHistory.parentElement.scrollTop = chatHistory.parentElement.scrollHeight;
  
  try {
    const data = await fetchWithRetry(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: 0.8,
        max_tokens: 1024,
      })
    });
    
    const aiResponseText = data.choices[0].message.content;
    
    // Remove loading and render markdown
    aiContentDiv.classList.remove('loading');
    aiContentDiv.classList.add('markdown-body');
    aiContentDiv.innerHTML = marked.parse(aiResponseText);
    
    // Save to context
    messages.push({ role: 'assistant', content: aiResponseText });
    
  } catch (error) {
    console.error('Error fetching from API:', error);
    aiContentDiv.classList.remove('loading');
    aiContentDiv.textContent = 'Oops! Connection issue or API limit reached. Retried but still failed.';
    aiContentDiv.style.color = '#ef4444';
  }
});
