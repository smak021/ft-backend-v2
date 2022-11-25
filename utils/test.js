const cheerio = require('cheerio')
const axios = require('axios')












let bms =  ()=>{

    // json_data=['KOCH','KOZH','TRIV']
    // const url = 'https://in.bookmyshow.com/pwa/api/uapi/movies'


    // for(let item of json_data)
    // {
    //     payload='{"bmsId":"1.2572928712.1661954374374","regionCode":"'+item+'","isSuperstar":"N"}'
    //     axios.post(url,payload,{headers:{'content-type':'application/json'}}).then( data=>{
    //         let readData = data.data.nowShowing.arrEvents;
    //         for(let it1 of readData)
    //         {                  
    //             for(let it2 of it1.ChildEvents)
    //             {
    //                 const filmName = it2.EventName;
    //                 console.log("bm",filmName);
    //                 const filmId = it2.EventCode
                    axios.get("https://in.bookmyshow.com/kochi/movies/kooman/ET00322179").then( ({ data })=>{
                        // const filmUrl = it2.EventURL
                        // const releaseDate = it2.EventDate
                        // const imageUrl = it2.EventImageCode
                        // read story and cast
                            // console.log(htmlData);
                            const $ = cheerio.load(data)
                            const sc = $('section#component-1').map((_, product)=>{
                                return $(product).text()
                            })
                            const story = sc[0]
                            var index = story.indexOf("ie");  
                            var text = story.substring(index + 2);  
                            
                            // Cast n Crew
                        const cast = $('section#component-4').map((_, product)=>{
                            let cast_p = product.lastChild.lastChild.lastChild.childNodes.map(itr=>{
                                    let cst = itr.childNodes.map(itr2=>{
                                        return $(itr2).text();
                                    })
                                    return [cst[1],cst[2]]
                            })
                            return cast_p
                        }).toArray()
                
                        const crew = $('section#component-5').map((_, product)=>{
                            
                            let crew_p = product.lastChild.lastChild.lastChild.childNodes.map(itt=>{
                                
                                
                                let crew =   itt.childNodes.map((itt1)=>{

                                    let img = itt1.childNodes.map((im)=>{

                                        console.log($(im).attr('data-cfsrc'))
                                    })
                                //     let img =  $(itt1+"> h5").text()
                                // console.log(img);
                                el = $(itt1)
                                   
                                    if(!(el.length === 0 || el.prop('tagName') === 'DIV')) 
                                    return el.text()
                                })
                                return [crew[1],crew[2]]
                            })
                            return crew_p
                        }).toArray()
                            // End
                       
                            // console.log("Loop");
                            // console.log("addbmsfilms");

                    })
                }
//             }
//         }).catch((err=>{
//             // console.log(err);
//         }))

//     }

// }

bms()











// setTimeout(() => {
// for (let i in [1,2,3,4])
// {
//     let today = new Date()

// console.log("Hello",today);
// const yyyy = today.getFullYear();
// let mm = today.getMonth() + 1; // Months start at 0!
// let dd = today.getDate();
// console.log(today);
// if (dd < 10) dd = '0' + dd;
// if (mm < 10) mm = '0' + mm;

// const formattedToday = yyyy+ '' + mm + dd;
// console.log(formattedToday);
// console.log(today.toLocaleDateString('en-IN',{formatMatcher:'best fit'}));
// }
// }, 5000);




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