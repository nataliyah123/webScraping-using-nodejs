const $= require('cheerio');
const rp=require('request-promise');
const Table=require('cli-table');
const puppeteer = require('puppeteer');
const emoji=require('node-emoji');
// const $ = require('jquery');

let options={
	url:"https://www.freecodecamp.org/forum/directory_items?period=weekly&order=likes_received&_=1562142501154",
	json:true
};
let table =new Table({
	head:['username',emoji.get('sparkling_heart'),'challenges'],
	colWidth:[15,5,15]
});
let rows=0;

  rp(options).then((data)=>{
	let userData=[];
	for(let user of data.directory_items){
		
		userData.push({user:user.user.username,likes_received:user.likes_received});
	}
	process.stdout.write('loading');
	
	 getChallengesCompletedAndPushToUserArray(userData);
  })
	.catch((err)=>{
			console.log(err);
           }
		  );

 async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

 function getChallengesCompletedAndPushToUserArray(userData){
	var i=0;
	var result=0;
	  function next(){
		if(i<userData.length){
		   var name=userData[i].user.toLowerCase();		    
		    var url1=`https://www.freecodecamp.org/`+name;		    			
			(async () => {
			  process.stdout.write('.')	;
			  const browser = await puppeteer.launch()
			  const page = await browser.newPage()
			  await page.goto(url1) ;			 
			   await timeout(5000);				  			  	
			  const result=await page.evaluate(()=>
			  	{ 
			  		
			  		const fccAccount =  document.querySelectorAll('.avatar-container').length==0;
			  		return fccAccount?'unknown': document.querySelectorAll('tbody tr').length
						 
			  	});  
			  
			  table.push([userData[i].user,userData[i].likes_received,result])
			  i++;	
			  await browser.close();
			  next();		  
			})()			 			
		}else{
			 return printData();
		}
	}
	return next();
}
function printData(){
	console.log('✔');
	console.log(table.toString());	
	
	
}