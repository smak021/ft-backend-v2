const cheerio = require('cheerio')
const axios = require('axios')

// Scrape shows seperatly then write and read main data using api
// New efficient method recommended.

// Objectives
// Reduce bm and pm api calls, either by delaying call by using interval or fetch show data, respective to current time and show time. 

// PTM
// FIlm based itteration
// Only one time per day
const filmsUrl = "http://localhost:8000/api/films/getfilms"
const CompleteLocUrl="http://localhost:8000/api/locations/getlocations/ptm?type=0"
axios.get(filmsUrl).then(({data})=>{
    
    data.map(item=>{
        const ptm_code = item.ptm_code
        axios.get(CompleteLocUrl).then((res)=>{
            res.data.map(it=>{
                const city = it.location
                url = "https://apiproxy.paytm.com/v3/movies/search/movie?meta=1&reqData=1&city="+city+"&movieCode="+ptm_code+"&version=3&site_id=1&channel=HTML5&child_site_id=1" 
                axios.get(url).then(result=>{
                    for(let tcode of it.theatre_codes)
                    {



                   console.log(result.data.pageData.sessions[tcode])



                   
                    }
                })
                // console.log(it.location);

            })






        })
        // console.log(item.full_name);
        // console.log(item.ptm_code);



    })

})
const filmLocUrl = "localhost:8000/api/data/getTheatreData/ET00337244"
// url = "https://apiproxy.paytm.com/v3/movies/search/movie?meta=1&reqData=1&city="+city+"&movieCode="+code+"&version=3&site_id=1&channel=HTML5&child_site_id=1" 
