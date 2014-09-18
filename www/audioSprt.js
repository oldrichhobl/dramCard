/**
 * ovladani AUDIO v programu Sprt
 * zajistuje zastaveni pri dlasim pozadavku na prehravani
 * vynechano posouvani ukazovatka 
 * 2014-07-21 oh.
 */

// *******************************
var myPLAY = 1;
var mySTOP = 2;
var myREPEAT = 3;
var myNONE = 0;

var audistav = 0;
var audioFile = "XXXXXX";
var audioPosition = 0;
var audioDur = 0;
// posouvaci krouzek
var pslength = 320;
var pscount  = 0;

//*********************************
// Audio player android
//
var my_media   = null;  // media pro android
// 
// api-media chrome
var myCh_media = null;   // media pro Chrome
var zvukEnd    = true;   // zvuk byl ukoncen
// 
// Play audio
//
function playFile(filename,odkud)
// zastavi stare prehravani a spusti nove
{
	console.log("playFile():" + filename);
    // freeMediaObj();
        if (my_media) {  // pro android s cordova
    	console.log("STOP my_media():" + my_media);
        my_media.stop();
        }

    audioFile = filename;         	    
    playAudio(filename,odkud);         
}

function freeMediaObj()
// uvolni zdroje pro prehravani
{
    if (my_media) {  // pro android s cordova
    	console.log("freeMedia():" + my_media);
        my_media.stop();
        audistav = mySTOP;
        my_media.release;
	my_media = null;
    }
    if (myCh_media) {  // pro chrome 
        myCh_media.stop();
        audistav = mySTOP;
        myCh_media.release;
	myCh_media = null;
    }  
}

function playAudio(src,odkud) {
    // Create Media object from audioFile
    // alert("PlayAudio: " + src);
    audistav = myPLAY;
    audioDur = -1;
    console.log("playAudio():" + my_media);
    if(isChrome)
    {
     if (myCh_media === null) { 	    
      myCh_media = new Audio(src);      // create new audio
      myCh_media.play();                // start playing
      zvukEnd = false;                  // zvuk zatim neukoncen  
      };
    };
    
    if(!isChrome)
    {
      console.log("playAudio New Media(): " + my_media);
      my_media = new Media(src, onSuccessAudio, onErrorAudio);
      if (odkud) my_media.seekTo(odkud);
      // Play audio
      console.log("playAudio play(): " + my_media);
      my_media.play();
    }
    // nastavSoupatko(1);
    // startCitac();
}


function onPlayStopKey(but)
{
	    // stisk tlacitka play/stop
	    if(my_media){  // funkcni pouze pokud jiz bylo vytvoreno MEDIA
		  if(audistav == myPLAY) // kdyz se hraje vypnout
	    	  {
	    	    pauseAudio();
	            audistav = mySTOP;
	            but.innerHTML = 'Play';
	            return;
              }
		      if(audistav == mySTOP) // kdyz se stoji zapnout
	    	  {
		    	my_media.play();
	            audistav = myPLAY;
	            but.innerHTML = 'Stop';
	            startCitac();
	            return;
              }
	      }	             	    
	    if(myCh_media){  // funkcni pouze pokud jiz bylo vytvoreno MEDIA
	    	    alert( myCh_media.currentTime );
	    	    
	    }
}

// seek audio
// 
function seekAudio(pos) {
  my_media.seekTo(pos);
}  

// skip audio
// 
function skipAudio(plus) {
    if (my_media) {
     // get my_media position
     my_media.getCurrentPosition(
     // success callback                 
            function(position) {    
                 if (position > -1) { 
                 // posunut�
                 var pos = position*1000 + plus;
                 my_media.seekTo(pos);
                 
                 setAudioPosition((position));  
                      }     },   
                       // error callback                       
                        function(e) {                        
                            console.log("Error getting pos=" + e);  
                             setAudioPosition("Error: " + e);        
                               }
                               );
     // document.getElementById('filelength').innerHTML = my_media.getDuration();
    }
}
//
// Stop audio
// 
function stopAudio() {
    if (my_media) {
        my_media.stop();
    };
    if (myCh_media) {
        myCh_media.stop();
    }  
}
//
// onSuccess Callback
//
function onSuccessAudio() {
// vola se po skonceni prehravky nebo po prikazu stop
// v obou pripadech uvolnime zdroje
      console.log("playAudio():Audio Success");
      freeMediaObj();
//    document.getElementById('filname').innerHTML = filename;
//    audioDur = my_media.getDuration();
}
//
// onError Callback 
//
function onErrorAudio(error) {
    if(error.code == 0) return;	
    console.log('Audio Error code: '    + error.code    + '\n' + 
                'message: ' + error.message + '\n');
}
//
// Set audio position
// 
function setAudioPosition(position) {
	audioPosition = position;
	var cas = position.toFixed();
	var min = Math.floor(cas / 60);
	var sec = cas - min*60;
	var hod = Math.floor(cas / 3600);
	min = min - hod*60;

	// delku je treba nacist az pri prehravani
	if (audioDur < 0) {
		if(my_media)  audioDur = my_media._duration;
	        if(myCh_media)  audioDur =  myCh_media.currentTime;
	}
	// zobrazeni cisla 
        document.getElementById('audio_position').innerHTML = 
             " " + (hod<10 ? "0"+hod:hod) +":"+(min<10 ? "0"+min:min)+":"+(sec<10 ? "0"+sec:sec);
       // posunuti krouzku
       if(pscount >= 100)
    	{
    	  var pos = (audioPosition / audioDur) * 100 ;
    	  nastavSoupatko(pos);
     	pscount = 0;
    	}
}


