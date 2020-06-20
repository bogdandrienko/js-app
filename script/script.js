"use strict";

const valueFilms = prompt('Сколько?', '3');
alert(valueFilms);

const personalDB = {
    count: valueFilms,
    movies: {},
    actors: {},
    genres: [],
    privat: false
};

const  a = prompt('First?', ''),
       b = prompt('Second?', ''),
       c = prompt('Third?', ''),
       d = prompt('Fourth?', '');

personalDB[a] = b;
personalDB[c] = d;

document.write(a);
document.write(c);

//let arr = [1, 2, 3, 4, 5];
//console.log(arr[4]);
//
//alert(arr)

//const result = confirm('Макси слабак?');
//alert(result + 5);

//const answer = prompt('Вам есть 18?', "18");
//alert(answer);

//(typeof(answer))
//+

//alert('10' + 5);

//let result = [];
//result[0] = prompt('Первое число индекса?', '');
//result[1] = prompt('Второе число индекса?', '');
//result[2] = prompt('Третье число индекса?', '');
//document.write(result);

//const category = 'toys';
//alert(`Привет, ${category}`);