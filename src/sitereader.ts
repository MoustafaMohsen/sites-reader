import * as http from "http";
import * as https from "https";
//import * as DomParser  from "dom-parser";
import * as windows1256 from 'windows-1256';
//var iconv = new Iconv('UTF-8', 'ISO-8859-1');
import * as cheerio from "cheerio";

//var parser = new DomParser();
export class SiteReader {
  constructor() {
  }
  //// ===================================================================
  //// ==================== NEW CODE =======================================
  //// ===================================================================

  objectifyHtmlString(str:string,id:string):MyHtmlObject[]{
    const $ = cheerio.load(str);

    let HtmlArray:MyHtmlObject[]=[];

    let digger = (nodes)=>
    { 
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];

            if( node && node.type =="text"){
                let htmlobject:MyHtmlObject;
                let attribs = node.parent.attribs
                let tagename=node.parent.tagName
                htmlobject={
                  attribs,
                  tagename,
                  text:node.data
                }
                HtmlArray.push(htmlobject);
            }//if

            else{
                digger(node.childNodes);
            }

        }//for

    }//digger

    digger( $(`#${id}`) );
    return HtmlArray;
  }
  

  // making request
  request(URL:string,htmlId:string,URLMaker:Function,Stop:Function): MyHtmlObjectArray[]{
    // my variables
    var Results : MyHtmlObjectArray[]=[];
    let currentUrl:string=URL;
    var _this=this;

    var callback = response => {
      var responseBody = []; 
      //response.setEncoding("WINDOWS-1255");
      response.once("data", function(chunk) {
        var _responseBody;
      });
      response.on("data", function(chunk) {
        responseBody.push(chunk)
      });

      response.on("end", function() {

        var buffer = Buffer.concat(responseBody);
        var binary = buffer.toString('binary');
        const text = windows1256.decode(binary, {
          'mode': 'html'
        });

        // text is the get response html

        let HTML_Request_Id_Object:MyHtmlObject[] = _this.objectifyHtmlString(text,htmlId);

        let HTML__Result:MyHtmlObjectArray = {
            html:text,
            url:currentUrl,
            htmlObject:HTML_Request_Id_Object,
        }

        Results.push(HTML__Result);

        //recursive request
        try {
            let isStop=Stop(currentUrl);
            if (isStop) {
                // end the get request
                console.log("Request stack ended");
                return;
            }
            else{
                currentUrl =URLMaker(currentUrl);
                _this.GET(currentUrl,callback);
            }

            } 
            catch (err) {
              console.error(err);
            }        
      });

    };//callback

    // Start the recursive eequest
    _this.GET(currentUrl,callback);
    return Results;
  }
  GET(url: string, callback: Function) {
    return http.get(url, function(response) {
      callback(response);
    }); //get
  }//GET

}//class


interface MyHtmlObject{
    text:string // the text
    attribs:any // the parent attribs
    tagename:string // the parent html tag
}


interface MyHtmlObjectArray{
    url:string;
    html:string;
    htmlObject:MyHtmlObject[];
}
