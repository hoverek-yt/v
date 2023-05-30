![v-logo](https://github.com/hoverek-yt/v/assets/89012686/c0142eed-0bc4-424a-a3e3-47221a57ee80)
# v
A simple and lightweight library for Vanilla JavaScript, allowing you to create a reactive UI.

# Features
- ♾️ Declarative syntax ( 😎 **_functional components!_** )
- ⚛️ Reactive state management based on nice Binding ( **_valueOf_** )
- 👌 Powerful reactive lists ( **_listOf_** based on [**Map**](https://github.com/hoverek-yt/v/wiki/function-listOf) )
- ✅ _**No VDOM!**_ - less memory usage
- 💅 Bindable styles:
```js
style: { color: myValue.bind() } // changing myValue will affect the css property 'color'
```

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
      textContent: 'New Todo',
      onclick() {
        if(todoContent.value.trim() !== '') {
          todos.add(todoContent.value);
          todoContent.value = '';
        }
      }
    }),
    $('div', {}, todos.bindEach((value, key) => {
      return $('p', {
        textContent: value,
        onclick() {
          todos.remove(key);
        }
      });
    }))
  ]);
}

document.body.appendChild(TodosApp());
```

Text nodes as children:
```js
import { $, valueOf } from './v.js';

function Counter() {
  const counter = valueOf(0);
  
  return $('button', {
    onclick() {
      ++counter.value;
    }
  }, [ 'Clicked: ', counter.bind(), ' times' ]);
}
```

# Todo
- ❔ SVG Elements support
- Maybe more...

_Future versions will fix bugs and improve performance_
