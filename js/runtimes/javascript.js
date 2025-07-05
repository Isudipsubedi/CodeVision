export function run(code) {
  try {
    new Function(code)();
  } catch (e) {
    console.log('Error:', e.message);
  }
}
