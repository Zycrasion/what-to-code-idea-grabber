const https = require('https');
const fs = require('fs');
let pages = [];
let pageNo = 0;;
let finished = false;
async function getPage(page)
{
    return new Promise((resolve) => {
        https.get(`https://what-to-code.com/api/ideas?sort=POPULAR&page=${page}`,(res) =>
        {
            let data = '';
            res.on('data', (chunk)=>{
                data += chunk;
            })
            res.on('end', async () => {
                pages.push(JSON.parse(data));
                console.log(page);
                if (data=='[]')
                {
                    resolve();
                    pageNo = page;
                } else
                {
                    await getPage(page+1);
                    resolve();
                }
            })
            
        }).on("error", (err) => {
            console.log("Error: " + err.message); 
        })
    });
}

(async () =>
{
    await getPage(0);
    fs.writeFile("./what-to-code.txt","What To Code:\nhttps://what-to-code.com\nPages Written:"+pageNo.toString()+"\n\n",() => {})
    
    for (page of pages)
    {
        for (idea of page)
        { 
            let string = `Title: ${idea.title}\n\tDescription: ${idea.description}\n\tlikes: ${idea.likes}\n\n`;
            console.log(string);
            fs.appendFile("./what-to-code.txt",string,()=>{});
            await new Promise((resolve) => setTimeout(resolve,500))
        }
    }
})()