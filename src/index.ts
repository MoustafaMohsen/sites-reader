import * as http from "http";
import * as https from "https";
//import * as DomParser  from "dom-parser";
import * as jsdom from "jsdom";
import * as windows1256 from 'windows-1256';
import * as Iconv from 'iconv'
//var iconv = new Iconv('UTF-8', 'ISO-8859-1');
import * as fs from 'fs'
const { JSDOM } = jsdom;
//var parser = new DomParser();
export class MyClass {
  constructor() {
    //this.server.listen(3000);
    console.log("Server listening on port 3000");
  }

  server = this.CreateServer();
  CreateServer() {
    var _this = this;
    var _server = http.createServer(function(req, res) {
      //res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      //res.writeHead(200, { "Content-Type": "text/plain; charset=windows-1256" });


      
    }); //createServer

    return _server;
  }

  pageRequest(){
    const hadithidstart=0
    const hadithidMax = 1000;
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
          var remainingTime=avrageRequestTime*(hadithidMax-hadithid)
          if (hadithid < hadithidMax) {
            console.log(`currnt:${hadithid}, remaining:${hadithidMax-hadithid}, done:${hadithid-hadithidstart},avrageRequestTime:${avrageRequestTime}, est:${Math.floor(remainingTime) }`);
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

var myclass = new MyClass();
myclass.pageRequest()