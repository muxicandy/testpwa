/*
 * @Author: sunny06
 * @Email: liyangyang06@zuoyebang.com
 * @Date: 2022-04-11 10:59:46
 * @LastEditors: sunny06
 * @LastEditTime: 2022-04-12 14:27:17
 * @Description: this is a file!
 */

let ul = document.getElementById('container');
(async () => {
    let request = new Request('/api/list', {
        method: 'get',
    })
    let r = await fetch(request);
    let data = await r.json();
    ul.innerHTML = data.map(val => {
        return `<li>${val}</li>`
    }).join('');
})()