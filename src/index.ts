import * as URL from "url";
import { SiteReader, CustomHTMLObjectArray } from "./sitereader";

let url = "https://en.wikipedia.org/wiki/2";
let id = "toc";

function pathParser(url: string): string[] {
  let parsed = URL.parse(url);
  let pathArray = parsed.pathname.split(/\//);
  return pathArray;
  /** 
    let FirstPathName = pathArray[1]?pathArray[1].match(/[a-z|A-Z]+/):""
    let index1 = parseInt(pathArray[1]);
    let index2 = parseInt(pathArray[2]);
    let index3 = parseInt(pathArray[3]);
    */
}

function getStringNumbers(str: string) {
  if (!str || typeof str !== "string") {
    return null;
  }
  // regex matching
  const regex = /(\d+)/gm;
  let m;
  let numberStr = "";
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    numberStr += m[1];
  }
  //return numberStr;
  if (numberStr == "") {
    return null;
  }

  let number = parseInt(numberStr);
  return number;
}

function URLMaker(url: string): String {
  let pathArray = pathParser(url);
  // check the path is parsed correctly otherwise stop requesting
  if (pathArray == null || pathArray == [] || pathArray.length < 1) {
    throw "url path is not a parseable";
  }

  let lastPath = pathArray[pathArray.length - 1];

  let number = getStringNumbers(lastPath);
  if (number < 5) {
    return "https://en.wikipedia.org/wiki/" + (number + 1);
  } else {
    throw "end it";
  }
}

// this function dynamicly changes the next url based on inputs like the last result, all resutls and the last requested url
function DynamicURLMaker(
  currentUrl,
  HTML__Result: CustomHTMLObjectArray,
  Results: CustomHTMLObjectArray[]
) {
    
}

let sitereader = new SiteReader();
let resutl = sitereader.request(url, id, URLMaker, results => {
  console.log("Request ended");
});
