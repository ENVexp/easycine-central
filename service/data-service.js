import axios from "axios";
import { resolveDns } from "../utils.js";

async function getCategories(dns, username, password) {
    const url = `${resolveDns(dns)}player_api.php?username=${username}&password=${password}&action=get_vod_categories`;
    const res = await axios.get(url);
    return res.data;
}

async function getMovies(dns, username, password) {
    const url = `${resolveDns(dns)}player_api.php?username=${username}&password=${password}&action=get_vod_streams`;
    const res = await axios.get(url);
    return res.data;
}

async function generateLogin() {
    const url = 'https://tchead.store/chatbot/check/?k=e99ee1f480';
    const res = await axios.post(
        url,
        {
            "receiveMessageAppId": "PACOTE_DO_APP",
            "receiveMessagePattern": ["1020"],
            "senderName": "Resale",
            "groupName": "",
            "senderMesage": "1020",
            "senderMessage": "1020",
            "messageDateTime": "TIMESTAMP_AQUI",
            "isMessageFromGroup": false
        }
    );
    const data = String(res.data.data[0].message).split('\n');
    return {
        'username': data[0].trim(),
        'password': data[1].trim()
    };
}

export {
    generateLogin,
    getCategories,
    getMovies
};
