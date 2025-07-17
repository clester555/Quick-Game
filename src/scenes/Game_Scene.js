export class Game_Scene extends Phaser.Scene{



    constructor(){
        super({key:'game-scene'});
        this.images = [];
        this.transport = ['balloon',
                    'bike',
                    'bus',
                    'helicopter',
                    'horse',
                    'car',
                    'rocket',
                    'motorboat',
                    'motorcycle',
                    'plane',
                    'train',
                    'truck',
                    'van'];
        this.transport_buttons= [];
        this.locations = ['school','store','restaurant','park','movie','library','beach', 'circus', 'museum'];
        this.location_buttons = [];
        this.people = ['astronaut','Buzz','FlyGuy','doctor','boy','girl','police', 'students']
        this.people_buttons = [];
        this.buttons = [];
        this.numOfChoices = 5;
        this.myScale = 0.9;
        this.seconds = 0;
        this.t_seconds = 0;
        this.m_seconds = 0;
        this.sentence = 'hello';
        this.answers = [0,0,0];
        this.correct = 0;
        this.answered = 0;
        this.personFound = false;
        this.locationFound = false;
        this.transportFound = false;
        this.penalty = 5;

        this.voices = []; this.tom_voice = null;
    

    }

    getVoices(){
        this.voices = window.speechSynthesis.getVoices();
        
        //const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
        //console.log(englishVoices)
        //this.tom_voice = this.voices.find(voice => voice.name === 'Tom');
    }


    preload(){
        this.load.image('check_mark','assets/images/check.png');
         this.load.image('reset_button','assets/images/resetButton.png');
        this.load.image('red_x','assets/images/redX.png');
         this.load.image('repeat_button','assets/images/audioButton.png');
        this.load.audio('buzz', 'assets/sounds/buzz.mp3');
          this.load.audio('ding', 'assets/sounds/ding.mp3');
        for(let q = 0 ; q<this.transport.length; q++) {
            this.load.image(this.transport[q],'assets/images/'+ this.transport[q]+'.png');
        }
         for(let q = 0 ; q<this.locations.length; q++) {
            this.load.image(this.locations[q],'assets/images/'+ this.locations[q]+'.png');
        }
        for(let q = 0 ; q<this.people.length; q++) {
            this.load.image(this.people[q],'assets/images/'+ this.people[q]+'.png');
        }
    }

    create(){
        this.getVoices();
        this.buzz = this.sound.add('buzz');
        this.ding = this.sound.add('ding');
        this.repeatButton = this.add.image(1400,74,'repeat_button').setInteractive().setScale(0.5);
        this.repeatButton.on('pointerdown', () => {
            this.speak(this.sentence);
        });
     //window.speechSynthesis.getVoices().forEach(voice => {
  //console.log(`${voice.name} [${voice.lang}]`);
//});


        let h_space = (1600-(256*this.myScale*5))/6;
     let v_space = (800-(256*this.myScale*3))/4;
     let half = 128*this.myScale;
     let full = 2*half;

        
        for(let q = 0 ; q<this.numOfChoices; q++) {
             this.transport_buttons.push(this.add.image(h_space+half+q*(h_space+full),775,'balloon').setInteractive().setScale(this.myScale));
             this.buttons.push(this.transport_buttons[q]);
            this.transport_buttons[q].on('pointerdown', () => {
                this.transport_buttons[q].disableInteractive();
                if(this.answers[2] == q){
                     this.transport_buttons[q].setTexture('check_mark')
                     this.correct+=3;
                     this.ding.play();
                     
                }else{
                     this.transport_buttons[q].setTexture('red_x')
                      this.seconds+=this.penalty;
                      this.buzz.play();
                }
             });
        }
        for(let q = 0 ; q<this.numOfChoices; q++) {
             this.location_buttons.push(this.add.image(h_space+half+(full+h_space)*q,525,'park').setInteractive().setScale(this.myScale));
             this.buttons.push(this.location_buttons[q]);
             this.location_buttons[q].on('pointerdown', () => {
                this.location_buttons[q].disableInteractive();
                if(this.answers[1] == q && !this.locationFound){
                    this.location_buttons[q].setTexture('check_mark')
                    this.ding.play();
                    this.correct+=1;
                    this.locationFound = true;
                }else{
                     this.location_buttons[q].setTexture('red_x')
                     this.seconds+=this.penalty;
                     this.buzz.play();
                }
             });
        }
          for(let q = 0 ; q<this.numOfChoices; q++) {
             this.people_buttons.push(this.add.image(h_space+half+(full+h_space)*q,275,'police').setInteractive().setScale(this.myScale));
             this.buttons.push(this.people_buttons[q]);
            this.people_buttons[q].on('pointerdown', () => {
                this.people_buttons[q].disableInteractive();
                if(this.answers[0] == q && !this.personFound){
                     this.people_buttons[q].setTexture('check_mark')
                     this.ding.play();
                     this.correct+=1;
                     this.personFound = true;
                }else{
                     this.people_buttons[q].setTexture('red_x')
                      this.seconds+=this.penalty;
                      this.buzz.play();
                }
             });
        }
        this.clock = this.add.text(800 ,50,"0.0",{
                fontSize: '40px',
                fontFamily: 'Arial'
                }).setOrigin(0.5);
         this.score = this.add.text(140 ,50,"Answers = 0",{
                fontSize: '40px',
                fontFamily: 'Arial'
                }).setOrigin(0.5);

        
        this.resetButton = this.add.image(800,450,'reset_button').setInteractive().setVisible(false);
        this.resetButton.on('pointerdown', () => {
            this.reset();
        });

      this.getQuestion();

    }

    reset(){
        this.answered = 0;
        this.seconds = 0;
        this.m_seconds = 0;
        this.t_seconds = 0;
        this.score.text = 'Answers = 0';
        this.resetButton.setVisible(false);
        this.resetButton.disableInteractive();
        this.getQuestion();
    }


    getQuestion(){
        this.setInteractive();
        this.correct = 0;
        this.locations = this.shuffle(this.locations);
        this.people = this.shuffle(this.people);
        this.transport = this.shuffle(this.transport);
        this.personFound = false;
        this.locationFound = false;
        this.transportFound = false;
        for(let q = 0; q<5;q++){
            this.transport_buttons[q].setTexture(this.transport[q]);
            this.location_buttons[q].setTexture(this.locations[q]);
            this.people_buttons[q].setTexture(this.people[q]);      
        }
        for(let q = 0; q<5;q++){
            this.answers[q]=Phaser.Math.Between(0,4);
        }
        let p = this.people[this.answers[0]];
        switch (p){
            case 'Buzz':
                p='Buzz '
                break;
            case 'FlyGuy':
                p='Fly Guy '
                break;
            case 'police':
                p='The police officer '
                break;
            default:
                p= 'The ' + p + ' ';
        }
        let l = this.locations[this.answers[1]];
        switch (l){
            case 'movie':
                l='the movie theatre ';
                break;
            case 'store':
                l='the toy store '
                break;
            default:
                l = 'the ' + l + ' ';
        }
        let t = this.transport[this.answers[2]];

        
         switch (t){
            case 'balloon':
                t='in a hot air balloon.';
                break;
            case 'car':
                t='in a car.'
                break;
            case 'van':
                t='in a van.'
                break;
            case 'truck':
                t='in a truck.'
                break;
            default:
                t= 'on a ' + t +'.';
        }
        if(this.people[this.answers[0]]=='students'){
            this.sentence = p + 'ride to ' + l + t;
        }else{
            this.sentence = p + 'rides to ' + l + t;
        }
        this.speak(this.sentence);
        console.log(this.sentence)
    }

    shuffle(arr){
        let t = 0;
        let b = 0;
        for(let q = 0; q<arr.length;q++){
            b = Phaser.Math.Between(0,arr.length-1);
            t=arr[q];arr[q]=arr[b];arr[b]=t;
        }
        return arr;
    }


    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
       // utterance.voice = this.tom_voice;
        utterance.lang = 'en-US'; // You can change the language
        utterance.rate = .8;
        window.speechSynthesis.speak(utterance);
    }
    
    update(t,dt){
        if(this.answered >5){return};
       
        if(this.correct>2){
            this.answered +=1;
            this.correct = 0;
            console.log(this.answered.toString());
            this.score.text = 'Answered = ' + this.answered.toString();
            if(this.answered<5) {this.getQuestion();}

        };
        this.m_seconds +=dt;
        if (this.m_seconds>100){
            this.m_seconds-=100;
            this.t_seconds+=1;
            if(this.t_seconds>9){
                this.t_seconds-=10;
                this.seconds+=1;
            }
            //let t = Math.round(this.seconds * 10) / 100;
            this.clock.text = this.seconds.toString()+'.'+this.t_seconds;
        }
         if(this.answered == 5){
            this.resetButton.setVisible(true);
            this.resetButton.setInteractive();
            this.answered = 6;
        }
    }

    setInteractive(){
         this.buttons.forEach((x) =>{
            x.setInteractive();
        });
    }

    setVisible(visible){
        this.buttons.forEach((x) =>{
            x.setVisible(visible);
        });
    }

}