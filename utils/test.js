const cheerio = require('cheerio')
const axios = require('axios')


setTimeout(() => {
for (let i in [1,2,3,4])
{
    let today = new Date()

console.log("Hello",today);
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();
console.log(today);
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const formattedToday = yyyy+ '' + mm + dd;
console.log(formattedToday);
console.log(today.toLocaleDateString('en-IN',{formatMatcher:'best fit'}));
}
}, 5000);




// let string = '2022-10-21T14:00'
// let res = string.split("T")
// console.log(res[0].replaceAll("-",""));


// axios.get("https://in.bookmyshow.com/kozhikode/movies/rorschach/ET00337244").then(({ data })=>{

//         const $ = cheerio.load(data)
//         const cast = $('section#component-4').map((_, product)=>{
//             let cast_p = product.lastChild.lastChild.lastChild.childNodes.map(itr=>{
//                     let cst = itr.childNodes.map(itr2=>{
//                         return $(itr2).text();
//                     })
//                     return [cst[1],cst[2]]
//             })
//             return cast_p
//         }).toArray()

//         console.log(cast);

//         const crew = $('section#component-5').map((_, product)=>{
            
//             let crew_p = product.lastChild.lastChild.lastChild.childNodes.map(itt=>{
                
//               let crew =   itt.childNodes.map(itt1=>{
//                     return $(itt1).text()
//                 })
//                 return [crew[1],crew[2]]
//             })
//             return crew_p
//         }).toArray()



//     })