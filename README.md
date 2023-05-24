# v
A simple and lightweight library for Vanilla JavaScript, allowing you to create a reactive UI.

# Basics

Simple counter:
```js
import { $, valueOf } from './v.js';

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

document.body.appendChild(CounterApp());
```

Todo app:
```js
import { $, listOf, valueOf } from './v.js';

function TodosApp() {
  const todos = listOf();
  const todoContent = valueOf('');

  return $('div', {}, [
    $('input', {
      value: todoContent.bind(),
      onchange(e) {
        todoContent.value = e.target.value;
      }
    }),
    $('button', {
      textContent: 'New Todo'
    }),
    $('div', {}, todos.bindEach((value, key) => {
      return $('p', { textContent: value });
    }))
  ]);
}
```
