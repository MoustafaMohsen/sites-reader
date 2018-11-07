export const Greeter = (name: string) => `Hello ${name}`;

export class MyClass {
  Doc: any;
  constructor() {
    var xmlString = "<div id='foo'><a href='#'>Link</a><span></span></div>",
      parser = new DOMParser(),
      doc = parser.parseFromString(xmlString, "text/xml");
    doc.firstChild; // => <div id="foo">...
    doc.firstChild; // => <a href="#">...
    console.log(doc, "class constructed");
    this.Doc = doc;
  }
  test() {
    console.log(this.Doc);
  }

  makeUrl(bookid:number,hadithId:number) {
    //let hadithId = 0 ; //bukhari max 7236
    //let bookid = 0;//bukhari 0, muslim 1
    return `http://www.islamweb.net/maktaba/nindex.php?flag=1&bookid=${bookid}&id=${hadithId}&page=bookpages`;
  }
}

var myclass = new MyClass();
console.log("testing test method()");

myclass.test();
