//Developed by **Edxen** (https://github.com/edxen)

let speech = new SpeechSynthesisUtterance();
speech.lang = 'en';
speech.rate = 1;
speech.volume = 1;
speech.pitch = 1;

var words = data,
    speaking = false,
    counter=0;

let voices = [];
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[4];
    let voiceSelect = document.querySelector('#select_voices');
    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
    document.querySelector('#select_voices').selectedIndex='4';
};
speech.addEventListener('start', function(event) {
    document.querySelector('#btn-control>i').className='bi-stop-fill';
});
speech.addEventListener('end', function(event) {
    document.querySelector('#btn-control>i').className='bi-play-fill';
});
document.querySelector('#select_voices').addEventListener('change', () => {
    speech.voice = voices[document.querySelector('#select_voices').value];
});

document.querySelector('#btn-start').addEventListener('click', () => {
    if(!speaking){
        speaking=true;
        document.querySelector('#btn-start').innerText='Stop Auto Reader';
        for(var i = 0; i < words.length;i++){
            task(i);
        }
    }else{
        speaking=false;
        document.querySelector('#btn-start').innerText='Start Auto Reader';
        var highestTimeoutId = setTimeout(";");
        for (var i = 0 ; i < highestTimeoutId ; i++) {clearTimeout(i);}
        window.speechSynthesis.cancel();
    }
});

function task(i){
    var letter_length = document.querySelector('#select_letter_count').selectedOptions[0].value,
        random_word,
        pass = false;

    while(!pass){
        random_word = words[Math.floor(Math.random() * 2467)];
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
    }, 2000 * i);
}

document.querySelector('#btn-control').addEventListener('click', () => {
    if(document.querySelector('#btn-control>i').className=='bi-play-fill'){
        tts();
    }else{
        window.speechSynthesis.cancel();
    }
});

function tts(value){
    var input = document.querySelector('#input-word'),
        logs = document.querySelector('#textarea-logs');

    counter++;
    if(value){
        input.value=value;
    }
    speech.text = input.value;
    window.speechSynthesis.speak(speech);
    logs.value=counter+': '+input.value+'\n'+logs.value;
}