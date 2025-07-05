const languageTopics = {
  javascript: ["hoisting", "eventloop"],
  python: ["fibonacci", "recursion"],
  go: ["hello", "loop"],
  sql: ["joins", "aggregation"],
  react: ["useEffect", "state"],
};

const runtimes = {
  javascript: "./runtimes/javascript.js",
  python: "./runtimes/python.js",
  go: "./runtimes/go.js",
  sql: "./runtimes/sql.js",
  react: "./runtimes/react.js",
};

const languageSelect = document.getElementById("language-select");
const topicsContainer = document.getElementById("topics");
const codeEditor = document.getElementById("code-editor");
const outputConsole = document.getElementById("output-console");
const runButton = document.getElementById("run-button");

// ⬇️ Topic content containers
const topicContent = document.getElementById("topic-content");
const topicText = document.getElementById("topic-text");
const topicLink = document.getElementById("topic-link");
const topicDetails = document.getElementById("topic-details");

let selectedLanguage = "javascript";

// Populate language dropdown
Object.keys(languageTopics).forEach((lang) => {
  const option = document.createElement("option");
  option.value = lang;
  option.textContent = lang;
  languageSelect.appendChild(option);
});

// Change language
languageSelect.onchange = () => {
  selectedLanguage = languageSelect.value;
  renderTopicButtons(selectedLanguage);
  codeEditor.value = "";
  clearConsole();
  hideTopicDetails();
};

// Render topic buttons for selected language
function renderTopicButtons(language) {
  topicsContainer.innerHTML = "";
  languageTopics[language].forEach((topic) => {
    const btn = document.createElement("button");
    btn.textContent = topic;
    btn.onclick = () => loadTopic(language, topic);
    topicsContainer.appendChild(btn);
  });
}

// Load code snippet + fetch Notion data
async function loadTopic(language, topic) {
  const path = `js/topics/${language}/${topic}.${getFileExtension(language)}`;
  try {
    // Load code
    const res = await fetch(path);
    const code = await res.text();
    codeEditor.value = code;
    clearConsole();

    // Fetch topic content from server (Notion)
    const explainRes = await fetch(`/topic/${topic}`);
    const { content, text, pageUrl } = await explainRes.json();

    topicContent.textContent = content || "";
    topicText.textContent = text || "";

    topicLink.innerHTML = pageUrl
      ? `<a href="${pageUrl}" target="_blank">📄 Open full Notion page</a>`
      : "";

    // 🔁 Embed the Notion page directly
    document.getElementById("notion-frame").src = pageUrl || "";

    // Show topic details
    topicDetails.style.display = "block";
  } catch (err) {
    codeEditor.value = `// Failed to load code: ${err.message}`;
    topicContent.textContent = `❌ Failed to load explanation: ${err.message}`;
    topicText.textContent = "";
    topicLink.innerHTML = "";
    topicDetails.style.display = "block";
  }
}

// Run code
runButton.onclick = async () => {
  clearConsole();
  overrideConsole();

  try {
    const code = codeEditor.value;
    const runtime = await import(runtimes[selectedLanguage]);
    await runtime.run(code);
  } catch (err) {
    logToOutput(`❌ ${err.message}`);
  }

  restoreConsole();
};

// Helpers
function getFileExtension(language) {
  if (language === "javascript" || language === "react") return "js";
  if (language === "python") return "py";
  if (language === "sql") return "sql";
  if (language === "go") return "go";
  return "txt";
}

function clearConsole() {
  outputConsole.innerHTML = "";
}

let originalConsoleLog;
function overrideConsole() {
  originalConsoleLog = console.log;
  console.log = (...args) => {
    args.forEach((arg) => {
      const div = document.createElement("div");
      div.textContent = String(arg);
      outputConsole.appendChild(div);
    });
  };
}

function restoreConsole() {
  console.log = originalConsoleLog;
}

function logToOutput(msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  outputConsole.appendChild(div);
}

function hideTopicDetails() {
  topicContent.textContent = "";
  topicText.textContent = "";
  topicLink.innerHTML = "";
  topicDetails.style.display = "none";
}

// Initialize with default
renderTopicButtons(selectedLanguage);
hideTopicDetails();
