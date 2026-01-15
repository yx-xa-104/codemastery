import HtmlEditor from '@/components/editor/HtmlEditor';

export default function HtmlDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            HTML/CSS/JS Editor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Interactive code editor with live preview. Try editing the code below!
          </p>
        </div>

        <HtmlEditor
          initialHtml={`<div class="card">
  <h1>Welcome to CodeMastery! 🚀</h1>
  <p>Edit the code and see live changes!</p>
  <button onclick="handleClick()">Click Me</button>
</div>`}
          initialCss={`body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
  max-width: 400px;
}

h1 {
  color: #667eea;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 1.5rem;
}

button {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #5568d3;
}`}
          initialJs={`function handleClick() {
  alert('Hello from CodeMastery! 👋');
  console.log('Button clicked!');
}

console.log('Page loaded successfully!');`}
          height="400px"
        />

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Features
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>✅ Tabbed interface for HTML, CSS, and JavaScript</li>
            <li>✅ Live preview with auto-run (toggleable)</li>
            <li>✅ Sandboxed iframe for security</li>
            <li>✅ Console output capture</li>
            <li>✅ Reset to initial code</li>
            <li>✅ Monaco Editor with syntax highlighting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
