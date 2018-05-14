var express = require('express');
var querystring = require('querystring');
var request = require('request');
var CHANNEL_ACCESS_TOKEN = 'BOpCS2JXlx/6DfqGmLVD9vU8FmjviF0TV/QJoLfkN0C465BHYiKtyfzP1Ov4wEIcF7xFvwu64T/RrO64+cai0dY7Th5yno/goN9+dJVa4EsLoNC5JV4mYF7ROws6Og6vfHByaSO/qQRZR8sy5Bz/twdB04t89/1O/w1cDnyilFU=';
var FormData = require('form-data');
var fs = require('fs');

/**const message = {
  type: 'text',
  text: 'Hello World!'
};

client.replyMessage('<replyToken>', message)
  .then(() => {
    ...
  })
  .catch((err) => {
    // error handling
  });**/

//event will like:
/**
 * 
{ type: 'message',
  replyToken: 'xxxxxxx',
  source: 
    { userId: 'xxxxxxx',
      type: 'user',
      profile: [Function] },
  timestamp: 1484472609833,
  message: 
    { type: 'text',
      id: 'xxxxxxxxxx',
      text: 'hihi',
      content: [Function] },
  reply: [Function] }
}
 */

//------------build TCP/IP-------------
function linebotParser(req ,res){
    // 定义了一个post变量，用于暂存请求体的信息
    var post = '';     
 
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
    req.on('data', function(chunk){    
        post += chunk;
    });
 
    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function(){    
        post = JSON.parse(post);
        console.log(post.events[0]);
        var replyToken = post.events[0].replyToken;
        /**var userMessage = post.events[0].message.text;
        console.log(replyToken);
        console.log(userMessage);**/
        var options = {
          url: "https://api.line.me/v2/bot/message/reply ",
          method: 'POST',
          headers: {
            'Content-Type':  'application/json', 
            'Authorization':'Bearer ' + CHANNEL_ACCESS_TOKEN
          },
          json: {
              'replyToken': replyToken,
              'messages': [post.events[0].message]
          }
      };
      if(post.events[0].message.type == 'image'){
            
      }

        if (typeof replyToken === 'undefined') {
            return;
        }
        var imgurl="";
        if(post.events[0].message.type == 'image'){
            // Configure the request
            var options = {
              url: 'https://api.line.me/v2/bot/message/'+ post.events[0].message.id +'/content',
              method: 'GET',
              headers: {                
                'Authorization':'Bearer ' + CHANNEL_ACCESS_TOKEN
              }
            }

            // Start the request
            request(options, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  // Print out the response body
                  console.log(body2);
                  console.log(response);                  
                  fs.writeFile(__dirname+"/img.txt",body,(err)=>{
                    if(err){
                      console.log(err);
                    }else{
                      console.log("the file was saved");
                    }
                  }).then(
                    function(){

                      readFile((__dirname+"/img.txt",(err,file)=>{
                        if(err){
                          console.log(err);
                        }else{
                          console.log(file);
                        }
                      }))

                      var imurg_options = {
                        url: "https://api.imgur.com/3/image ",
                        method: 'POST',
                        headers: {
                          //'Content-Type':  'application/json', 
                          'Authorization':'Client-ID ' +'72cb7e9c1af69b4',
                          //'Cache-Control': 'no-cache',
                          //'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        formData: 
                        { image: 
                         { value: 'fs.createReadStream(body)',
                          options: 
                          { filename: __dirname+"/img.txt",
                            contentType: null } } } };     
                    
                      
                    request(imurg_options, function (error, response, body) {                    
                        if (error) throw error;
                        console.log(body);
                        imgurl=body.link;
                    });
                  })
              }else{
                console.log("!!!!!error when recpt image!!!!!");                
              }
            }).then(function(){
              options.json.messages[0].originalContentUrl=imgurl;
              options.json.messages[0].previewImageUrl=imgurl;
              request(options, function (error, response, body) {
                if (error) throw error;
                console.log(body);
              });
            }              
            )
            return;          
        }        
          
        request(options, function (error, response, body) {
            if (error) throw error;
            console.log(body);
        });
    });

}

const app = express(); //建立一個express 伺服器
app.post('/' , linebotParser); // POST 方法**/

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen((process.env.PORT || 8080), function() {
    var port = server.address().port;
    console.log("App now running on port", port);
});
//!!!

