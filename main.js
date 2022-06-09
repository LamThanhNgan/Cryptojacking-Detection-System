const fs = require("fs");
const crypto = require("crypto");
const puppeteer = require("puppeteer");
const Promise = require('bluebird');
const { url } = require("inspector");

const directory = "./wasm/";
const wrapper = fs.readFileSync("./wrapper.js", "utf8");
const hosts = [];


let browser;
let page;
let dir;
let existsASMmodule = false;

const path = process.argv[2];

async function init(){
    browser = await puppeteer.launch().catch(e => console.error('[x] Error!', e.message));
}

function wasmFound(data) {
    existsASMmodule = true;
    //Use hash as filename for deduplication
    console.log("DATA:", data.length);
    const filename = crypto.createHash("md5").update(data).digest("hex");
    fs.writeFileSync(dir + "/" + filename, Buffer.from(data, "base64"));
}
async function wasmCollector(url, index){
    dir = directory + index.toString();
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    await init();
    console.log("[+] ", url, "is being collected ...");
    page = await browser.newPage();
    try{
        await page.exposeFunction("wasmFound", source => wasmFound(source));
        await page.evaluateOnNewDocument(wrapper);
    }catch(e){
        console.error('[x] Error!', e.message);
    }
    await page.goto(url)

    //Wait a bit, to make sure the Wasm as chance to load
    await new Promise(done => setTimeout(done, 50000));
    await browser.close();

    if(existsASMmodule == false){
        console.log("[!] No ASM module found in this URL");
    }
    console.log("[+] Done! ", url, "has been collected, at "+ dir);
    await browser.close();
    dir = "";
}
async function proceed(list_urls){
    if(!list_urls.length) return;
    try{
        const requests = await Promise.map(
            list_urls,
            async (url, index, length) =>{
                try{
                    if(!hosts.includes(url)){
                        hosts.push(url);
                    }
                }
                catch(e){
                    console.info('[!] Number of URLs processed:', index);
                }
            }
        );
    }
    catch(e){
        console.error('[x] Error!', e.message);
    }
    finally {
        //await browser.close();
        for (let i = 0; i < hosts.length; i++) {
            await wasmCollector(hosts[i], i);
          }
    }
}

(async () => {
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }
    if(/^https?:\/\//i.test(path)){
        // // return proceed([path]);
        // console.log("LINK");
    }
    else {
        try{
            fs.readFile(path, 'utf8', (error, data) => {
                proceed(data.trim().split('\n'));
            });
        }
        catch(e){
            console.error('[x] Error!', e.message);
        }
    }
})();
