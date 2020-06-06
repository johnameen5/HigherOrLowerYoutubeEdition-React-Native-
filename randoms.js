import axios from "axios";
import data from "./data";
const { apikey, channels, categories } = data;

let category = "";
let section1 = {};
let section2 = {};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCategory() {
    let random = getRandomInt(0, categories.length - 1);
    //console.log(random);
    return categories[random];
}

function randomAccount(except) {
    let random = getRandomInt(0, channels.length - 1);
    while (channels[random].ID === except) {
        random = getRandomInt(0, channels.length - 1);
    }
    //console.log(random);
    return channels[random];
}

async function getDataFromServer(searchInfo) {
    let result = {};
    if (searchInfo.type === "channel") {
        result = await axios.get(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${searchInfo.ID}&key=${apikey}`
        );
        //console.log(result.data.items[0].statistics);
    } else if (searchInfo.type === "user") {
        result = await axios.get(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=${searchInfo.ID}&key=${apikey}`
        );
        //console.log(result.data.items[0].statistics);
    }
    return {
        channelInfo: searchInfo,
        statistics: result.data.items[0].statistics,
    };
}

async function getRound(firstAttempt, existingID) {
    let account1 = {};
    let account2 = {};

    if (firstAttempt) {
        let a1_search_info = randomAccount("");
        let a2_search_info = randomAccount(a1_search_info.ID);
        //console.log("Account 1", a1_search_info);
        //console.log("Account 2", a2_search_info);
        account1 = await getDataFromServer(a1_search_info);
        account2 = await getDataFromServer(a2_search_info);

    } else {
        let a1_search_info = channels.find((channel) => channel.ID == existingID);
        let a2_search_info = randomAccount(a1_search_info.ID);
        //console.log("Account 1", a1_search_info);
        //console.log("Account 2", a2_search_info);
        await getDataFromServer(a1_search_info);
        account1 = await getDataFromServer(a1_search_info);
        account2 = await getDataFromServer(a2_search_info);
    }
    return {
        account1: account1,
        account2: account2,
        category: randomCategory()
    };
}

export default {
    getRandomCategory: randomCategory,
    getRandomAccount: randomAccount,
    getRound: getRound,
};