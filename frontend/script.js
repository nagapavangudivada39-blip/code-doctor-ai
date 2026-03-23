async function analyzeError() {
  const input = document.getElementById("input").value;
  const language = document.getElementById("language").value;
  const chat = document.getElementById("chat");

  if (!input) return;

  chat.innerHTML += `<div class="message user">${input}</div>`;
  document.getElementById("input").value = "";

  chat.innerHTML += `<div class="message bot">⏳ Thinking...</div>`;

  try {
    const response = await fetch("https://YOUR-RENDER-URL/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: input, language })
    });

    const data = await response.json();

    chat.lastChild.remove();

    const codeId = "code-" + Date.now();

    chat.innerHTML += `
      <div class="message bot">
        <b>🧠 Problem:</b><br>${data.problem}<br><br>
        <b>💡 Solution:</b><br>${data.solution}<br><br>
        <b>📊 Confidence:</b> ${data.confidence}<br><br>

        <b>🧾 Code:</b>
        <div class="code-box">
          <pre><code id="${codeId}" class="language-${language}">${data.code}</code></pre>
          <button onclick="copyCode('${codeId}')">📋 Copy</button>
        </div>
      </div>
    `;

    hljs.highlightAll();

  } catch (err) {
    chat.lastChild.remove();
    chat.innerHTML += `<div class="message bot">❌ Server error</div>`;
  }

  chat.scrollTop = chat.scrollHeight;
}

function copyCode(id) {
  const code = document.getElementById(id).innerText;
  navigator.clipboard.writeText(code);

  const btn = event.target;
  btn.innerText = "✅ Copied";

  setTimeout(() => {
    btn.innerText = "📋 Copy";
  }, 1500);
}