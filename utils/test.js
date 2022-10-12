const cheerio = require('cheerio')
const axios = require('axios')

axios.get("https://in.bookmyshow.com/kozhikode/movies/rorschach/ET00337244").then(({ data })=>{

        const $ = cheerio.load(data)
        const cast = $('section#component-4').map((_, product)=>{
            let cast_p = product.lastChild.lastChild.lastChild.childNodes.map(itr=>{
                    let cst = itr.childNodes.map(itr2=>{
                        return $(itr2).text();
                    })
                    return [cst[1],cst[2]]
            })
            return cast_p
        }).toArray()

        console.log(cast);

        const crew = $('section#component-5').map((_, product)=>{
            
            let crew_p = product.lastChild.lastChild.lastChild.childNodes.map(itt=>{
                
              let crew =   itt.childNodes.map(itt1=>{
                    return $(itt1).text()
                })
                return [crew[1],crew[2]]
            })
            return crew_p
        }).toArray()



    })