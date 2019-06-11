import './style.css';
import {sayMyName,nameMe} from '@tworry/standard-es6-lib';

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

var component = () => {
  var element = document.createElement('div');
  element.innerHTML = sayMyName('2222')+nameMe('111');
  return element;
}
console.log(component)
console.log(sayMyName)

document.getElementById('main').appendChild(component());
