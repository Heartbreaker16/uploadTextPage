//匹配规则
var reg = /[.。！!？?:：·～(\n)(\r)(\n\r)(\r\n)]/;
var bookReg = /[(《.*?》)]/;
var quoteReg = /["“'‘.*?’'”"]/;
var endSymbol = /[。！!？?…～:：]+/;
var changeLineReg = RegExp(/[(\n)(\r)(\r\n)(\n\r)]/)

//占位中间字符串
var BOOK_PLACEHOLDER = "《%-#-@#》";
var QUOTE_PLACEHOLDER = "“%-#-@#”。";

var QUOTE_PLACEHOLDER_2 = "“%-#-@#”";

//主函数
function sentenceSplit(originSentence) {
  if (originSentence === "") {
    console.log("this sentence is null");
    return null;
  }

  var initSentence = originSentence.split(reg);
  // console.log(originSentence);

  var bookList = getBookList(originSentence);
  var quoteList = getQuoteList(originSentence);
 

  //以下两个for循环用作处理引号与书名所包含的endSymbol规则的中间代码
  for (var i = 0; i < bookList.length; i++) {
    if (endSymbol.test(bookList[i])) {
      originSentence = originSentence.replace(bookList[i], BOOK_PLACEHOLDER);
    }
  }
  for (var i = 0; i < quoteList.length; i++) {
    if (endSymbol.test(quoteList[i])) {
      originSentence = originSentence.replace(quoteList[i], QUOTE_PLACEHOLDER);
    }
  }
  var symbolList = getSymbol(originSentence);

  //开始分句
  // originSentence = originSentence.replace(/(\n)|(\r)|(\r\n)|(\n\r)/g, "&#10;");
  var sentenceList = originSentence.split(reg);
  // console.log(sentenceList)
  for(var i =0 ;i<sentenceList.length;i++){
    // console.log(sentenceList[i])
    var tmp = sentenceList[i].replace(/[(\n)(\r)(\r\n)(\n\r)]/g, "&#10;")
    // console.log(tmp)
    if(sentenceList[i].length===0){
      sentenceList.splice(i,1,"&#10;")
    }
  }
  if (sentenceList[sentenceList.length - 1].length === 0) {
    sentenceList.pop();
  }
  // console.log(sentenceList);
  // console.log(symbolList);
  for (var i = 0; i < sentenceList.length&&i<symbolList.length; i++) {
    if (sentenceList[i] !== ""&&sentenceList[i]!=="&#10;") {
      sentenceList.splice(i, 1, sentenceList[i] + symbolList[i]);
    }
  }
  for(var i=0;i<sentenceList.length;i++){
    if(sentenceList[i].match(changeLineReg)){
      var temp = sentenceList[i].replace(changeLineReg,"&#10;")
      // console.log(temp)
      sentenceList.splice(i,1,temp)
    }
  }
  var tempList = restoreBookAndQuote(bookList, sentenceList, BOOK_PLACEHOLDER);
  // console.log(tempList);

  tempList = restoreBookAndQuote(quoteList, sentenceList, QUOTE_PLACEHOLDER_2);

  sentenceList = tempList;
  // console.log(tempList);
  
  console.log(sentenceList);

  return sentenceList;
}

//获取书名号包含的字符串数组
function getBookList(sentence) {
  var pat = new RegExp("《([^《|》]*)》", "g");
  var results = [];
  do {
    var res = pat.exec(sentence);
    if (res) {
      results.push(res[0]);
    }
  } while (res);
  return results;
}

//获取引号包含的数组
function getQuoteList(sentence) {
  var pat = new RegExp('(".*?")|(“.*?”)', "g");
  var results = [];
  do {
    var res = pat.exec(sentence);
    if (res) {
      results.push(res[0]);
    }
  } while (res);
  return results;
}

//还原书名号与引号中内容
function restoreBookAndQuote(List, sentenceList, BookOrQuotePlaceHolder) {
  for (var i = 0; i < List.length; i++) {
    // console.log(List[i])
    if (endSymbol.test(List[i])) {
      // console.log("111")
      for (var j = 0; j < sentenceList.length; j++) {
        if (sentenceList[j].indexOf(BookOrQuotePlaceHolder) !== -1) {
          // console.log(sentenceList[j]);
          let tempStr = sentenceList[j].replace(
            BookOrQuotePlaceHolder,
            List[i]
          );
          // console.log(tempStr);
          sentenceList.splice(j, 1, tempStr);
          break;
        }
      }
    }
  }
  return sentenceList;
}

function getSymbol(sentence) {
  var pat = /[.。！!？?:：·～(\n)(\r)(\n\r)(\r\n)]/g;

  var results = [];
  do {
    var res = pat.exec(sentence);

    if (res) {
      // console.log(res[0]);
      results.push(res[0]);
    }
  } while (res);
  // console.log(results);
  return results;
}
//测试
// getSymbol(
//   " 《奔跑吧！兄dei二。》机电产品进出口商会汽车分会的杨振恒秘书长认为，这个“摩托车分会”的成立是有好处的，不仅可以更好地为企业服务，还能让更多的企业有机会关心行业的共同发展～杨秘书长透露，得到有关上级主管部门的批准后，“摩托车分会”将有可能在今年年内成立，会长将通过选举，由主营企业的企业家来担任。我说：“很好！一起搞！”我拿起了《asdfa》，开始阅读。"
// // );
// sentenceSplit(
// );
// sentenceSplit("");
// sentenceSplit("7月8日早晨的肯德基，和往日有些不同。和往日有些不同。\n")