const request = require("request-promise")
const fs = require("fs")
const cheerio = require("cheerio")
const { itemIDList } = require("./items")
var itemsOnPage = []

async function downloadHTML(){
    let pageHTML = await request.get("https://www.corrosionhour.com/rust-item-list/")
    const $ = cheerio.load(pageHTML)

    
    var allItems = {}
    //Skip the first one as that's just the header bar
    let itemsArray = $(".ch-tbl-row")
    for (let index = 1; index < itemsArray.length; index++) {
        let item = $(".ch-item-list-table > tbody > tr:nth-child("+ index + ")")
        let shortName = item.find("td")[1].children[0].data
        let itemIdNumber = item.find("td")[2].children[0].data

        shortName = shortName.toString()
        itemIdNumber = parseFloat(itemIdNumber)
        // const itemIdentity = {
        //     [shortName] : itemIdNumber
        // }
        allItems[shortName] = itemIdNumber
    }

    var jsonData = JSON.stringify(allItems, null, "\t");
    fs.writeFileSync("itemsJson.json", jsonData)
    //For now I just manually take the entire json string and copy it into the items.js file so const itemIDList = { HERE GOES ALL THE JSON DATA } 
}

downloadHTML()