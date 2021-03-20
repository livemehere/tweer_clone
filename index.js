const posting = document.querySelector('#posting');
const tweets = document.querySelector('.tweets');
let isLoaded = false;

function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
  
    if (n.length < digits) {
      for (i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
  }
  
  

function getTimeStamp() {
    var d = new Date();
    var s =
        leadingZeros(d.getFullYear(), 4) + '-' +
        leadingZeros(d.getMonth() + 1, 2) + '-' +
        leadingZeros(d.getDate(), 2);

    return s;
}


let socket = io();

function createTweet(tweet){
    const li = document.createElement('li');
    li.className='tweet';
    li.innerHTML=`
    <div class="title">${tweet.title}    <span class="date">${tweet.date}</span></div>
    <div class="name">${tweet.name}</div>
    <div class="content">${tweet.content}</div>
    <div class="like_hate">LIKE <span>${tweet.like}</span> HATE <span>${tweet.hate}</span></div>
    `;
    tweets.appendChild(li);
}
    socket.on('/loadTweets',(results)=>{
        
        const tweets = JSON.parse(results);
        if(isLoaded == true){
            return;
        }else{
            isLoaded = true;
            tweets.map(tweet=>{
                console.log(tweet);
                createTweet(tweet);
            })
        }
        
    })


socket.on('/newTweet',(result)=>{
    const tweet = JSON.parse(result);
    createTweet(tweet);
})


posting.addEventListener('submit',(e)=>{
    e.preventDefault();
    const title = e.target.title.value;
    const name = e.target.name.value;
    const content = e.target.content.value;

    const data={
        title,
        name,
        content,
        date:getTimeStamp(),
        like:0,
        hate:0
        
    }

    console.log(data);
    socket.emit('/post',data);
    
    

    e.target.title.value='';
    e.target.name.value='';
    e.target.content.value='';

})