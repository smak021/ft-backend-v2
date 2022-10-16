const cheerio = require('cheerio')
const axios = require('axios')
const axiosThrottle = require('axios-request-throttle')
// Scrape shows seperatly then write and read main data using api
// New efficient method recommended.



// Objectives
// Reduce bm and pm api calls, either by delaying call by using interval or fetch show data, respective to current time and show time. 

// PTM
// FIlm based itteration
// Only one time per day
const filmLocUrl = "localhost:8000/api/data/getTheatreData/ET00337244?source=ptm"
const filmsUrl = "http://localhost:8000/api/films/getfilms"
const CompleteLocUrl = "http://localhost:8000/api/locations/getlocations/ptm?type=0"
axios.get(filmsUrl).then(({ data }) => {
    data.map(item => {
        const ptm_code = item.ptm_code
        const bmId = item.film_id
        axios.get(CompleteLocUrl).then((res) => {
            res.data.map(it => {
                const city = it.location
                url = "https://apiproxy.paytm.com/v3/movies/search/movie?meta=1&reqData=1&city=" + city + "&movieCode=" + ptm_code + "&version=3&site_id=1&channel=HTML5&child_site_id=1"
                axios.get(url).then(result => {
                    if (result.data) {
                        for (let tcode of it.data) {
                            try {
                                const theatre = result.data.meta.cinemas.filter(value => value.id == tcode.theatre_code)
                                if (theatre.length > 0) {
                                    const theatreName = theatre[0].name;
                                    let sdata = result.data.pageData.sessions[tcode.theatre_code]
                                    sdata.map(val => {
                                        const screenName = val.audi
                                        const showCode = val.sid
                                        const theatreCode = val.cid
                                        let showTime = val.showTime
                                        let showDate = showTime.split("T")[0].replaceAll("-", "")
                                        let total_Seats = 0; let avail_Seats = 0; let price = 0
                                        val.areas.map(dat => {
                                            const category = dat.label
                                            let offset = 0; let adjust = 0;
                                            if (tcode.offset != 'na') {

                                                for (let off of tcode.offset) {
                                                    let screen = off.screen_name
                                                    if (screen == screenName) {
                                                        for (let ro of off.off) {
                                                            if (ro.cat_name == category) {
                                                                offset = ro.value
                                                            }
                                                            if (ro.cat_name == "FTADJST") {
                                                                adjust = ro.value
                                                            }

                                                        }

                                                    }
                                                }
                                            }
                                            let totalSeats = dat.sTotal
                                            let availSeats = dat.sAvail
                                            totalSeats - availSeats < offset ? offset = 0 : '';
                                            availSeats + adjust + offset <= totalSeats ? offset += adjust : '';
                                            totalSeats < availSeats ? totalSeats = availSeats : '';
                                            total_Seats += totalSeats
                                            avail_Seats += (availSeats + offset)
                                            let bookedSeats = totalSeats - (availSeats + offset)
                                            price += (dat.price * bookedSeats)
                                        })
                                        let currTime = new Date().toLocaleString("en-IN")
                                        payload = {
                                            show_id: showCode,
                                            show_time: showTime,
                                            show_date: showDate,
                                            screen_name: screenName,
                                            ptm_count: {
                                                available: avail_Seats,
                                                price: price,
                                                total: total_Seats,
                                                name: theatreName
                                            },
                                            source: "ptm",
                                            theatre_code: theatreCode,
                                            last_modified: currTime,
                                            film: bmId
                                        }
                                        let upUrl = 'http://localhost:8000/api/shows/addshow'
                                        axios.post(upUrl, JSON.stringify(payload), { headers: { 'Content-type': 'application/json' } })
                                        // console.log(payload);
                                    })

                                    let today = new Date()
                                    const yyyy = today.getFullYear();
                                    let mm = today.getMonth() + 1; // Months start at 0!
                                    let dd = today.getDate();
        
                                    if (dd < 10) dd = '0' + dd;
                                    if (mm < 10) mm = '0' + mm;
        
                                    const formattedToday = yyyy+ '' + mm + dd;
                                    const getShows = "http://localhost:8000/api/shows/getShows?date="+formattedToday+"&filmId="+bmId+"&theatreCode="+tcode.theatre_code+"&source=ptm"
                                    axios.get(getShows).then(({data})=>{
                                        let avail =0;total=0;amount = 0;let currTime;let showDate;let theatreName
                                        // console.log(data);
                                        for (let item of data)
                                        {
                                            showDate = item.show_date
                                            // console.log(showDate);
                                            theatreName = item.ptm_count.name
                                            avail += parseInt(item.ptm_count.available)
                                            total += parseInt(item.ptm_count.total)
                                            amount += parseInt(item.ptm_count.price)
                                            
                                        }
                                        
                                        currTime = new Date().toLocaleString("en-IN")
                                                update ={
                                                    show_date: showDate,
                                                    show_count:data.length,
                                                    category_name: 'NA',
                                                    theatre_name:theatreName,
                                                    price: amount,
                                                    booked_seats: total-avail,
                                                    available_seats: avail,
                                                    total_seats: total,
                                                    theatre_code: tcode.theatre_code,
                                                    theatre_location: city,
                                                    last_modified: currTime,
                                                    film: bmId
                                                }  
                                
                                            // console.log(showDate,currTime,total);
                                            // console.log(bmId, tcode.theatre_code, upd.showDate);
                                            let updataUrl = "http://localhost:8000/api/data/addData/"+bmId+"/"+tcode.theatre_code+"/"+showDate
        
                                        axios.put(updataUrl, JSON.stringify(update), { headers: { 'Content-type': 'application/json' } })
                                    })

                                    
                                }
                            }
                            catch (err) {
                                console.log("Error", err);
                            }
                            



                        }

                        // console.log(city);
                    }
                })
                
            })
        })
    })
})
