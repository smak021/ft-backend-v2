const cheerio = require('cheerio')
const axios = require('axios')
const stringSimilarity = require('string-similarity')


let ptm=()=>{

    locations = ['kochi','kozhikode']
    for(let city of locations){

        website = 'https://paytm.com/movies/'+city
        axios.get(website,
            {
                headers:
                {
                    Cookie:{'movies_city': city}
                }
            })
                .then(({data})=>{

                    const $ = cheerio.load(data)
                    const scrape = $('script#__NEXT_DATA__').map((_, product)=>{
                        
                        let jsonData = JSON.parse($(product).text());
                        for(let itms of jsonData.props.pageProps.initialState.movies.currentlyRunningMovies[city].groupedMovies)
                        {
                            let fName = itms.label
                            for(let lang of itms.languageFormatGroups)
                            {
                                let filmLanguage = lang['lang']
                                let ptmCode = lang['fmtGrpId']
                                let film_data= axios.get('https://flicktrack.cyclic.app/api/films/getfilms').then(({data})=>{

                                for(let itm of data)
                                {
                                    let bmId = itm.film_id
                                    let bmName = itm.full_name
                                    let bmLang = itm.language
                                    let filmsimilarity = stringSimilarity.compareTwoStrings(bmName.toLowerCase(),fName.toLowerCase())
                                    let langSimilarity = stringSimilarity.compareTwoStrings(bmLang.toLowerCase(),filmLanguage.toLowerCase())
                                    if(filmsimilarity>0.8 && langSimilarity>0.8)
                                    {
                                        payload = {
                                            film_id:bmId,
                                            ptm_code:ptmCode
                                        }
                                        let upUrl = 'https://flicktrack.cyclic.app/api/films/addfilm/'+bmId
                                        axios.put(upUrl,JSON.stringify(payload),{headers:{'Content-type': 'application/json'}})
                                    }
                                }
                                })
                            }
                        }    
                    })
                }).catch((err)=>{
                    console.log(err);
                })
    }
}



let bms = async ()=>{

    json_data=['KOCH','KOZH','TRIV']
    const url = 'https://in.bookmyshow.com/pwa/api/uapi/movies'


    for(let item of json_data)
    {
        payload='{"bmsId":"1.2572928712.1661954374374","regionCode":"'+item+'","isSuperstar":"N"}'
        axios.post(url,payload,{headers:{'content-type':'application/json'}}).then(data=>{
            let readData = data.data.nowShowing.arrEvents;
            for(let it1 of readData)
            {
                for(let it2 of it1.ChildEvents)
                {
                    const filmName = it2.EventName;
                    const filmId = it2.EventCode
                    axios.get("https://in.bookmyshow.com/"+item+"/movies/"+filmName+"/"+filmId).then(({ data })=>{
                        const filmUrl = it2.EventURL
                        const releaseDate = it2.EventDate
                        const imageUrl = it2.EventImageCode
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
                                
                                let crew =   itt.childNodes.map(itt1=>{
                                    return $(itt1).text()
                                })
                                return [crew[1],crew[2]]
                            })
                            return crew_p
                        }).toArray()
                            // End
                        let castNCrew = {"cast":cast,"crew":crew}
                        const filmDuration = it2.Duration
                        const filmGenre = it2.EventGenre
                        const language = it2.EventLanguage
                        const censor = it2.EventCensor
                        const filmLocation = it2.RegCode
                        let updata={
                            film_id:filmId,
                            film_name: filmUrl,
                            cover_url:imageUrl,
                            language:language,
                            release_date: releaseDate,
                            film_story:text,
                            film_genre:filmGenre,
                            film_censor:censor,
                            film_duration:filmDuration,
                            full_name:filmName,
                            cast_n_crew:castNCrew,
                            highlight:0,
                            priority:0,
                            film_status:'active'
                        }
                        let upUrl = 'https://flicktrack.cyclic.app/api/films/addfilm/'+filmId
                        axios.put(upUrl,JSON.stringify(updata),{headers:{'Content-type': 'application/json'}})
                    })
                }
            }
        }).catch((err=>{
            console.log(err);
        }))

    }

}


bms()
ptm()
