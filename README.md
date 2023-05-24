# v
A simple and lightweight library for Vanilla JavaScript, allowing you to create a reactive UI.

# Basics

Simple counter:
```js
import { valueOf } from './v.js';

function CounterApp() {
  const counter = valueOf(0);

  return $('div', {}, [
    $('button', {
      textContent: counter.bind(v => `Clicked: ${v} times`),
      onclick() {
        ++counter.value;
      }
    })
  ]);
}
```
