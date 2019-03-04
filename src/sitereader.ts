import * as http from "http";
import * as https from "https";
import * as windows1256 from "windows-1256";
import * as cheerio from "cheerio";
import * as HttpRequest from "request";
export class SiteReader {
  constructor() {}
  //// ===================================================================
  //// ==================== NEW CODE =======================================
  //// ===================================================================

  objectifyHtmlString(str: string, id: string): CustomHtmlObject[] {
    const $ = cheerio.load(str);

    let HtmlArray: CustomHtmlObject[] = [];

    let digger = nodes => {
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];

        if (node && node.type == "text") {
          let htmlobject: CustomHtmlObject;
          let attribs = node.parent.attribs;
          let tagename = node.parent.tagName;
          htmlobject = {
            attribs,
            tagename,
            text: node.data
          };
          HtmlArray.push(htmlobject);
        } //if
        else {
          digger(node.childNodes);
        }
      } //for
    }; //digger

    digger($(`#${id}`));
    return HtmlArray;
  }

  // making request
  request(
    URL: string,
    htmlId: string,
    URLMaker: Function,
    callbackResult: Function,
    DynamicURLMaker?:Function
  ): CustomHTMLObjectArray[] {
    // my variables
    var Results: CustomHTMLObjectArray[] = [];
    let currentUrl: string = URL;
    var _this = this;

    var callback = (error, response, body) => {
      let HTML_Request_Id_Object: CustomHtmlObject[] = _this.objectifyHtmlString(
        body,
        htmlId
      );

      let HTML__Result: CustomHTMLObjectArray = {
        htmlObject: HTML_Request_Id_Object,
        html: body,
        url: currentUrl
      };

      Results.push(HTML__Result);

      //recursive request
      try {
        //create the next url
        if (DynamicURLMaker!=null) {
          currentUrl = DynamicURLMaker(currentUrl,HTML__Result,Results);
        }else{
          currentUrl = URLMaker(currentUrl);
        }

        _this.GET(currentUrl, callback);
      } catch (err) {
        if (err === "end it") {
          // end the get request
          callbackResult(Results);
          console.log("Request stack ended");
          return;
        }
        console.error(err);
      }
    }; //callback

    // Start the recursive eequest
    _this.GET(currentUrl, callback);
    return Results;
  }

  private GET(url: string, callback: Function) {
    return HttpRequest.get(url, (error, response, body) => {
      if (error) {
        throw error;
      }
      callback(error, response, body);
    });
  } //GET
} //class

export interface CustomHtmlObject {
  text: string; // the text
  attribs: any; // the parent attribs
  tagename: string; // the parent html tag
}

export interface CustomHTMLObjectArray {
  url: string;
  html: string;
  htmlObject: CustomHtmlObject[];
}
