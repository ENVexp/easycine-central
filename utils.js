function resolveDns(dns){
    return (String(dns).slice(-1) == '/') ? dns : dns + '/';
}

function clearText(text){
    return text
    .replace(/[\\\/:*?"<>|]/g, '_')  
    .replace(/\0/g, '')  
    .trim();
}

async function get(url) {
    return await (await fetch(url)).json();
}

export{
    resolveDns,
    get,
    clearText
}