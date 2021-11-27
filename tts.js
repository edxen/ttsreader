//Developed by **Edxen** (https://github.com/edxen)

let speech = new SpeechSynthesisUtterance();
speech.lang = 'en';
speech.rate = 1;
speech.voiceURI = "native";
speech.volume = 1;
speech.pitch = 1.5;
delay=.5;
step='0';
random_word='';

var words = data,
    spelling = false,
    counter=0,
    auto;

let voices = [];
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[2];
    let voiceSelect = document.querySelector('#select_voices');
    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
    document.querySelector('#select_voices').selectedIndex='2';
};
speech.addEventListener('start', function(event) {
    document.querySelector('#btn-control>i').className='bi-stop-fill';
});
speech.addEventListener('end', function(event) {
    document.querySelector('#btn-control>i').className='bi-play-fill';
    auto_task();
});
document.querySelector('#select_voices').addEventListener('change', () => {
    speech.voice = voices[document.querySelector('#select_voices').value];
});
document.querySelector("#range-speech-speed").addEventListener("input", () => {
    const rate = document.querySelector("#range-speech-speed").value;
    speech.rate = rate;
    document.querySelector("[for=range-speech-speed-value]").innerHTML = rate;
});
document.querySelector("#check-spelling").addEventListener("input", () => {
    spelling = !spelling;
});

document.querySelector("#range-word-delay").addEventListener("input", () => {
    delay = document.querySelector("#range-word-delay").value *  1000
    document.querySelector("[for=range-word-delay-value]").innerHTML = delay / 1000;
});

document.querySelector('#btn-start').addEventListener('click', () => {
    window.speechSynthesis.cancel();
    if(!auto){
        auto=true;
        document.querySelector('#btn-start').innerText='Stop Auto Reader';
        auto_task();
    }else{
        auto=false;
        document.querySelector('#btn-start').innerText='Start Auto Reader';
        var highestTimeoutId = setTimeout(";");
        for (var i = 0 ; i < highestTimeoutId ; i++) {clearTimeout(i);}
        window.speechSynthesis.cancel();
    }
});

function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if ((activeElTagName == "textarea") || (activeElTagName == "input" && /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) && (typeof activeEl.selectionStart == "number")){
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

document.onmouseup = document.onkeyup = document.onselectionchange = function() {
    var text = getSelectionText();
    if(text!=''){
        if(text!=null){
            if(text!=' '){
                document.querySelector("#input-word").value = text;
                tts();
                window.getSelection().removeAllRanges();
            } else {
                window.getSelection().removeAllRanges();
            }
        }
    }
};

function auto_task(){
    if(auto){
        if(spelling){
            var done = false;
            task();
            if(!done && step=='0'){
                step='1';
                done=true;
            }
            if(!done && step=='1'){
                step='2';
                counter--;
                done=true;
            }
            if(!done && step=='2'){
                step='0';
                counter--;
                done=true;
            }
            done=false;
        }else{
            task();
        }
    }
}

function task(){
    var letter_length = document.querySelector('#select_letter_count').selectedOptions[0].value,
        pass = false;

    while(!pass){
        if(step==0) random_word = words[Math.floor(Math.random() * 2467)];
        if(letter_length=='1') pass=true;
        if(random_word){
            if(letter_length=='2' && random_word.length=='3') pass=true;
            if(letter_length=='3' && random_word.length=='4') pass=true;
            if(letter_length=='4' && random_word.length=='5') pass=true;
            if(letter_length=='5' && random_word.length>'5') pass=true;
        }
    }
    setTimeout(function() {
        tts(random_word);
    }, 0+delay);
}

document.querySelector('#btn-control').addEventListener('click', () => {
    if(document.querySelector('#input-word').value!=''){
        if(document.querySelector('#btn-control>i').className=='bi-play-fill'){
            tts();
        }else{
            window.speechSynthesis.cancel();
        }
    }
});

function tts(value, skip){
    var input = document.querySelector('#input-word'),
        logs = document.querySelector('#textarea-logs');

    counter++;
    if(value){
        input.value=value.toUpperCase();
    }
    if(!spelling) step=0;
    if(step==2){
        speech.rate=.75;
        input.value=input.value.split('').join(' ').toUpperCase();
        console.log( input.value.split(' ').join(' - '));
        speech.text = input.value.split(' ').join(' - ');
    }else{
        speech.rate=document.querySelector("#range-speech-speed").value;
        speech.text = input.value;
    }
    window.speechSynthesis.speak(speech);
    if(!spelling || spelling && step==1 ){
        logs.value=counter+': '+input.value+'\n'+logs.value;
    }
}