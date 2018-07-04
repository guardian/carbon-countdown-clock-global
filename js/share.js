function getUrl() {
      var url = "http://www.theguardian.com";
      if ( window.self !== window.top ) {
        var hostname = document.referrer.split("://")[1].split("/")[0];
        console.log(hostname);

        if (hostname === 'www.theguardian.com' || hostname === 'viewer.gutools.co.uk') {
            console.log("on the guardian")
            url = document.referrer;
        }
        
        else {
            console.log("not on the guardian");
            url = "https://www.theguardian.com";
        }

      }
      else {
        console.log("not in an iframe");
        url = window.location.href;
      }
      console.log("finalUrl", url);
      return url;
}

function shareInteractive(){
        var shareButtons = document.querySelectorAll('.btns-share .social');
        for (var i = 0; i < shareButtons.length; i++) {
          shareButtons[i].addEventListener('click',openShareWindow);
        };

        function openShareWindow(e){
          var shareWindow = "";
          var twitterBaseUrl = "https://twitter.com/intent/tweet?text=";
          var facebookBaseUrl = "https://www.facebook.com/dialog/feed?display=popup&app_id=741666719251986&link=";
          var network = e.currentTarget.getAttribute('data-network'); 
          var sharemessage = "Carbon countdown clock: how much of the world's carbon budget have we spent? ";
          var shareImage = "";
          var hashtags = "GlobalWarning";
          var guardianUrl = "http://theguardian.com/au";
          guardianUrl = getUrl();

          if(network === "twitter"){
              shareWindow = 
                  twitterBaseUrl + 
                  encodeURIComponent(sharemessage) + 
                  "%20" + 
                  (encodeURIComponent(guardianUrl)) +
                  "&hashtags=" + hashtags;
              
          }else if(network === "facebook"){
              shareWindow = 
                  facebookBaseUrl + 
                  encodeURIComponent(guardianUrl) + 
                  "&picture=" + 
                  encodeURIComponent(shareImage) + 
                  "&redirect_uri=http://www.theguardian.com";
          }
          window.open(shareWindow, network + "share", "width=640,height=320");
        }

}