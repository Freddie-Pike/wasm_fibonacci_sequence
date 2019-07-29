// Times how long a function takes.
function timer(callbackName, callback, parameters) {
  console.time(`${callbackName} timer`);
  let callbackReturnValue = callback(parameters);
  console.timeEnd(`${callbackName} timer`);
  return callbackReturnValue;
}

// Vanilla JS implemention of the fibonacci sequence.
function fibo(n) {
  switch (n) {
    case 0:
      return 1;
    case 1:
      return 1;
    default:
      return (fibo(n - 1) + fibo(n - 2));
  }
}


fetch("../target/wasm32-unknown-unknown/release/fibo.wasm")
  .then(response => response.arrayBuffer())
  .then(buffer => WebAssembly.instantiate(buffer))
  .then(module => {
    const rustFibo = module.instance.exports.rust_fibo;

    fetch("../build/optimized.wasm")
      .then(response => response.arrayBuffer())
      .then(buffer => WebAssembly.instantiate(buffer))
      .then(module => {
        const typescriptFibo = module.instance.exports.typescript_fibo;

        let vanillaJSFiboValue = timer('vanillaJSFiboValue', fibo, 40);
        let wasmRustFiboValue = timer('wasmRustFiboValue', rustFibo, 40);
        let wasmTypescriptFiboValue = timer('wasmTypescriptFiboValue', typescriptFibo, 40);

        document.getElementById('vanilla-js-result').innerHTML = vanillaJSFiboValue;
        document.getElementById('rust-result').innerHTML = wasmRustFiboValue;
        document.getElementById('typescript-result').innerHTML = wasmTypescriptFiboValue;
      });
  });