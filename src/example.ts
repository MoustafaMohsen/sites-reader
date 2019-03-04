import * as http from "http";
import * as https from "https";
//import * as DomParser  from "dom-parser";
import * as jsdom from "jsdom";
import * as windows1256 from 'windows-1256';
import * as Iconv from 'iconv'
//var iconv = new Iconv('UTF-8', 'ISO-8859-1');
import * as fs from 'fs'
import * as filedata2 from "../jsons/books/Bukhari.model.json";
import * as filedata1 from "../jsons/books/IslameWebHadiths.json";
import * as filedata3 from "../jsons/IslamwebtoShaihBukhariMatches.json"
import * as URL from "url";
import * as filedata4 from "../jsons/books/IslamwebtoShaihBukhariMatches_close_matches.json"
import * as filedata5 from "../jsons/books/IslamwebtoShaihBukhariMatches_close_matches20.json";
import * as filedata6 from "../jsons/books/IslamwebtoShaihBukhariMatches_close_matches15.json";

const { JSDOM } = jsdom;
//var parser = new DomParser();
export class MyClass {
  IslameWebHadiths:IslameWebHadiths.HadithObject[]=[];
  SahihHadithsDb:SahihHadithsDb.HadithObject[]=[];
  HadithsComparsonsResults:IMasterToSlaveStringArrayResult[];
  HadithCloseArrays=[]
  constructor() {
    //this.server.listen(3000);
    this.IslameWebHadiths = (<any>filedata1).Array;
    this.SahihHadithsDb = (<any>filedata2);
    this.HadithsComparsonsResults = (<any>filedata3);
    this.HadithCloseArrays = (<any>filedata6)
    console.log("Server listening on port 3000");
  }

  server = this.CreateServer();
  CreateServer() {
    var _this = this;
    var _server = http.createServer(function(req, res) {
      //res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      //res.writeHead(200, { "Content-Type": "text/plain; charset=windows-1256" });
      let str=""
      let parsed =URL.parse(req.url);
      let pathArray=parsed.pathname.split(/\//);
      let FirstPathName = pathArray[1]?pathArray[1].match(/[a-z|A-Z]+/):""
      let index1 = parseInt(pathArray[1]);
      let index2 = parseInt(pathArray[2]);
      let index3 = parseInt(pathArray[3]);
      if (FirstPathName == "hadith") {
        
        let returnObject={
          comparson:_this.HadithsComparsonsResults[index1],
          IslameWeb:_this.IslameWebHadiths[index2]?_this.IslameWebHadiths[index2].HadithText:"",
          Shaih:_this.SahihHadithsDb[index3]?_this.SahihHadithsDb[index3].arabicText:""
        }
        str = JSON.stringify(returnObject);
        res.end(str)
      }
      let notfoundIndexe:IMasterToSlaveStringArrayResult[] = []
      _this.HadithsComparsonsResults.forEach(x=>{
        if (!x.found) {
          notfoundIndexe.push(x)
        }
      })
      let masterNormalized =_this.IslameWebHadiths.map( m=>_this.RemoveTshkeel(m.HadithText) );
      
      let notfounds : {
        sure: number;
        master: number;
        hadith: string;
        number: number;
        url: string;}[]=[]
      notfoundIndexe.forEach(n=>{
        n.masterIndex
        n.sure
        let notfound={
          sure:n.sure,
          master:n.masterIndex,
          hadith:masterNormalized[n.masterIndex],
          number:_this.IslameWebHadiths[n.masterIndex].HadithNumber,
          url:_this.IslameWebHadiths[n.masterIndex].url
        }
        if (notfound.number&&notfound.hadith&&notfound.hadith.trim()) {
          
          notfounds.push(notfound)
        }
      });

      let ignores = [56,59,67,74,127,135,243,245,328,365,412,471,759,776,901,905,986,1015,1146,1155,1187,1232,1340,1341,1353,1354,1363,1377,1428,1464,1497,1516,1547,1550,1574,1584,1666,1669,1683,1715,1836,2011,2089,2114,2117,2145,2168,2186,2208,2247,2272,2274,2298,2314,2315,2336,2423,2471,2495,2583,2605,2606,2609,2618,2629,2667,2795,2807,2808,2858,2859,2873,2914,3004,3016,3029,3124,3160,3161,3167,3169,3198,3224,3232,3238,3239,3244,3257,3288,3619,3623,3808,3900,3924,4199,4203,4270,4285,4296,4314,4331,4353,4361,4362,4365,4382,4390,4409,4415,4419,4428,4430,4434,4441,4442,4445,4448,4462,4469,4476,4482,4487,4488,4500,4502,4511,4515,4516,4519,4525,4528,4534,4548,4551,4552,4555,4562,4568,4570,4573,4575,4577,4578,4585,4587,4590,4592,4604,4608,4609,4615,4616,4628,4643,4646,4648,4649,4658,4665,4677,4686,4687,4691,4692,4693,4695,4697,4698,4707,4708,4714,4716,4718,4720,4721,4722,4724,4727,4728,4730,4731,4732,4734,4742,4745,4746,4748,4749,4755,4756,4762,4763,4764,4765,4766,4767,4768,4769,4770,4774,4782,4785,4787,4824,4843,4858,4878,4911,4927,4964,5059,5064,5065,5066,5084,5086,5110,5114,5146,5247,5327,5371,5460,5483,5626,5979,6005,6081,6122,6314,6379,6551,6587,6596,6697,6698,6751,6790,6853,6948,7002,7079,7192]
      let notfound=[]
      for (let i = 0; i < _this.HadithCloseArrays.length; i++) {
        const element = _this.HadithCloseArrays[i];
        let ignored = ignores.indexOf(element.masterIndex);
        let ignore = ignored !=-1 ;
        let hasclosest = !!element.slaveClosest || element.slaveClosest==0;
        if ( !hasclosest && !ignore ) {
          notfound.push(element)
        }
        
      }

      for (let i = 0; i < _this.HadithCloseArrays.length; i++) {
        const element = _this.HadithCloseArrays[i];
        element
        
      }
      
      
      str = JSON.stringify(_this.HadithCloseArrays.map(x=>{
        x.slaveClosestToIndex=null;
        x.slaveIndexs=null
        return x
      }))
      str = JSON.stringify(notfound)
      let buffer = Buffer.from(str,"utf-8");
      res.end(buffer);
      

      
    }); //createServer

    return _server;
  }

  RemoveTshkeel(str:string) {
    str=str?str:""
    var tashkeel_regex= /[\u064E\u0652\u064F\u0650\u0651\u064B\u064D\u064C\u06E1\u06DC\u06E3\u065A\u065C\u0653\u0670\u060E\u0610\u0611\u0612\u0613\u0614\u0615\u0616\u0617\u0618\u0619\u061A\u061C\u0654\u0655\u0656\u0657\u0658\u0659\u065B\u065D\u065E\u065F\u06D4\u06D6\u06D7\u06D8\u06D9\u06DA\u06DB\u06DD\u06DE\u06DF\u06E0\u06E2\u06E4\u06E5\u06E6\u06E7\u06E8\u06EA\u06EB\u06EC\u06ED]/g
    return str.replace(tashkeel_regex, "");
  }
  RemoveTshkeel_old(str: string) {
    var tashkeel_regex = /[ًٌٍَُِّْٰٓ]/g;
    return str.replace(tashkeel_regex, "");
  }
  

  pageRequest(){
    const hadithidstart=7001
    const hadithidMax = 7236;
    const bookid = 0;
    const filename = `contentBook(${bookid})(${hadithidstart}-${hadithidMax}).json`;
    
    var _this=this;
    var hadithid = hadithidstart;
    var startTime= Date.now()
    var ContetnArr:HadithContent[]=[]
    var callback = response => {
      var responseBody = []; 
      //response.setEncoding("WINDOWS-1255");
      response.once("data", function(chunk) {
        var _responseBody
         ;
      });
      response.on("data", function(chunk) {
        responseBody.push(chunk)
      });
      response.on("end", function() {

        var buffer = Buffer.concat(responseBody);
        var binary = buffer.toString('binary')
        const text = windows1256.decode(binary, {
          'mode': 'html'
        });
        var dom = _this.CreateDom(text);
        var object = _this.analyzeHadith(dom,bookid,hadithid,url);
        ContetnArr.push(object)

        //recursive request
        try {
          var avrageRequestTime = ( (Date.now()-startTime)/(1000) ) /(hadithid-hadithidstart);
          var remainingTime=avrageRequestTime*(hadithidMax-hadithid);
          //var Stagemax=(hadithidMax-hadithidstart)
          if (hadithid < hadithidMax) {
            console.log(`currnt:${hadithid}, prog:${( ( (hadithidMax-hadithidstart)/(hadithidMax-hadithid) )-1 )*100}%, remaining:${hadithidMax-hadithid}, done:${hadithid-hadithidstart},avrageRequestTime:${avrageRequestTime}, est:${Math.floor(remainingTime) }`);
            hadithid++;
            url =_this.makeUrl(0,hadithid)
            _this.GET(url,callback);
          }else{
            var fileDate= JSON.stringify(ContetnArr) 
            fs.writeFileSync(filename,fileDate)
            //console.log(JSON.parse(fileDate));
          }
        } catch (err) {
          console.error(err);
          console.error(`broke at ${hadithid}`);
          
          var fileDate= JSON.stringify(ContetnArr) 
            fs.writeFileSync(filename,fileDate)
        }
        
        //console.log( JSON.stringify(object) );
        
        
      });
    };

    var url =_this.makeUrl(0,hadithid)
    _this.GET(url,callback);
  }
  analyzeHadith(dom: Document,bookid:number,hadithid:number,url:string):HadithContent{
    var page :HadithContent={
      bookid:bookid,
      hadithid:hadithid,
      url:url,
      pagehtml:this.analyzDom(dom)
    }
    return page
  }
  analyzDom(dom: Document) {
    var html = dom.getElementById("pagebody")
      ? dom.getElementById("pagebody").innerHTML.trim()
      : "";
    var html_tashkeel = dom.getElementById("pagebody_thaskeel")
      ? dom.getElementById("pagebody_thaskeel").innerHTML.trim()
      : "";
      var text = dom.getElementById("pagebody_thaskeel")
      ? dom.getElementById("pagebody_thaskeel").innerText?
      dom.getElementById("pagebody_thaskeel").innerText.trim()
      :dom.getElementById("pagebody_thaskeel").innerText
      : "";

    var object:PageHtml = {
      html:html,
      html_tashkeel:html_tashkeel,
      text:text
    }
    return object
  }



  CreateDom(str: string) {
    return new JSDOM(str).window.document;
  }
  GET(url: string, callback: Function) {
    return http.get(url, function(response) {
      callback(response);
    }); //get
  }
  makeUrl(bookid: number, hadithId: number) {
    //let hadithId = 0 ; //bukhari max 7236
    //let bookid = 0;//bukhari 0, muslim 1
    return `http://www.islamweb.net/maktaba/nindex.php?flag=1&bookid=${bookid}&id=${hadithId}&page=bookpages`;
  }
}
interface HadithContent{
  pagehtml:PageHtml;
  bookid:number;
  hadithid:number;
  url:string
}
interface PageHtml{
  html_tashkeel:string;
  html:string;
  text:string;
}
declare module SahihHadithsDb {

  export interface InBookRefrence {
      book: number;
      hadith: number;
  }

  export interface OldRefrence {
      vol: number;
      book: number;
      hadith: number;
  }

  export interface HadithObject {
      id?: number;
      number: number;
      arabicHTML: string;
      arabicText: string;
      englishHTML: string;
      englishText: string;
      in_book_refrence?: InBookRefrence;
      old_refrence?: OldRefrence;
      page?:number;
      numberInBook?:number
  }

}

declare module IslameWebHadiths {

  export interface Htmlarr {
      text: string;
      isHidden: boolean;
      color: string;
      tag: string;
      face: string;
      aClass: string;
      aId: string;
      Recording: boolean;
      number?: number;
  }

  export interface HadithObject {
      HadithNumber: number;
      HadithPage: number;
      HadithText: string;
      bookid: number;
      hadithid: number;
      url: string;
      Htmlarr: Htmlarr[];
  }

}
export interface IMasterToSlaveStringArrayResult{
  masterIndex:number,
  slaveIndexs?:{
      index:number,
      sure:number
  }[];
  found:boolean;
  sure:number;
}

var myclass = new MyClass();
myclass.server.listen(3000)
//myclass.pageRequest()