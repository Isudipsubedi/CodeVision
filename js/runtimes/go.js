// js/runtimes/go.js
export async function run(code) {
  const res = await fetch('/run/go', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  const { output } = await res.json();
  console.log(output);
}
