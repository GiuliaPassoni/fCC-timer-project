import './App.css';
import React, { Component } from 'react';
import Duration from "./Duration";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used


class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            br_len:0,
            ss_len:0,
            currentTime:'',
            running:false,
            b_count:0,
            s_count:0,
            waitTime: 1000,
            isChecked: false
        };
        this.reset = this.reset.bind(this);
        this.counting=this.counting.bind(this);
        this.getLabel = this.getLabel.bind(this);
        this.testMode = this.testMode.bind(this);
        this.startCounting = this.startCounting.bind(this);
        this.asyncCall = null
    }
//   to call reset when age is loaded
    componentDidMount(){
        this.reset()
        this.asyncCall=window.setInterval(this.counting,this.state.waitTime)
    }
    componentWillUnmount(){
        clearInterval(this.asyncCall)
    }


    breakPlus(){
        console.log('breakplus',this.state.br_len)
        if(this.state.br_len<60 && this.state.br_len>=0){
            this.setState({
                br_len:this.state.br_len+1,
                b_count:(this.state.br_len+1)*60
            })
        }else if(this.state.br_len >=60){
            this.setState({
                br_len:60,
                b_count:60*60
            })
        }
    }
    breakMinus(){
        if(this.state.br_len>1){
            this.setState({
                br_len:this.state.br_len-1,
                b_count:(this.state.br_len-1)*60
            })
        }else if(this.state.br_len<=1){
            this.setState({
                br_len:1,
                b_count:60
            })
        }
    }
    sessionPlus(){
        console.log('sessionplus',this.state.ss_len)
        if(this.state.ss_len<60 && this.state.ss_len>=0){
            this.setState({
                ss_len:this.state.ss_len+1,
                s_count:(this.state.ss_len+1) * 60
            })
        }else if(this.state.ss_len >=60){
            this.setState({
                ss_len:60,
                s_count:60*60
            })
        }
    }
    sessionMinus(){
        if(this.state.ss_len>1){
            this.setState({
                ss_len:this.state.ss_len-1,
                s_count:(this.state.ss_len-1)*60
            })
        }else if(this.state.ss_len<=1){
            this.setState({
                ss_len:1,
                s_count:60
            })
        }
    }

    getTime(){
        let min,sec;
        if(this.state.s_count>=0){
            min = Math.floor(this.state.s_count/60);
            sec = Math.max((this.state.s_count-min*60),0);
        }else{
            min = Math.floor(this.state.b_count/60);
            sec = Math.max((this.state.b_count-min*60),0);
        }
        sec='00'+sec
        sec=sec.substr(sec.length-2)
        min='00'+min
        min=min.substr(min.length-2)
        return min+':'+sec;
    }

    startCounting(){
        if (this.state.running === false) {
            clearInterval(this.asyncCall);
            this.asyncCall=window.setInterval(this.counting,this.state.waitTime);
        }
        this.setState({
            running:!this.state.running
        })
    }

    counting(){
        if (this.state.running !== true) {
            return;
        }
        if(this.state.s_count>0 || this.state.b_count>0){
            if(this.state.s_count>=0){

                if (this.state.s_count === 1) {
                    const a = document.getElementById("beep");
                    a.play();
                }

                this.setState({
                    s_count:this.state.s_count-1
                })

            }else{

                this.setState({
                    b_count:this.state.b_count-1
                })
            }
        }else{
            const a = document.getElementById("beep");
            a.play();
            this.setState({
                s_count:this.state.ss_len * 60,
                b_count:this.state.br_len * 60
            })
        }
        // async function call based on time
        // calling this.setState periodically
    }

    getLabel(){
        if (this.state.s_count > 0) {
            return "Session";
        }
        else if (this.state.b_count > 0){
            return "Break";
        }
        return "Done!";
    }

    reset(){
        const a = document.getElementById("beep");
        a.pause();
        a.currentTime = 0;
        this.setState({
            br_len:5,
            b_count:5*60,
            ss_len:25,
            s_count:25*60,
            running:false
        });
        clearInterval(this.asyncCall)
    }

    testMode(){
        this.setState({
            waitTime: !this.state.isChecked ? 10 : 1000,
            isChecked: !this.state.isChecked
        })
    }

    render(){
        const currentTime =this.getTime()
        const timer_label = this.getLabel()

        return(
            <div className='all'>
                <main>
                    <div className='container dur'>
                        {/*
              <div>
                <h4>Testing?</h4>
                <input type="checkbox" id="testing" name="testing" value="bool" checked={this.state.isChecked} onChange={this.testMode}/>
              </div>
              */}
                        <div className='breakall'>
                            <button id="break-increment" disabled={this.state.running} onClick={this.breakPlus.bind(this)}><FontAwesomeIcon icon={solid('arrow-up')}/></button>
                            <Duration id='break-label' name="Break" insideId="break-length" defVal={this.state.br_len}/>
                            <button id ="break-decrement" disabled={this.state.running} onClick={this.breakMinus.bind(this)}><FontAwesomeIcon icon={solid('arrow-down')}/></button>
                        </div>
                        <div className='seshall'>
                            <button id="session-increment" disabled={this.state.running} onClick={this.sessionPlus.bind(this)}><FontAwesomeIcon icon={solid('arrow-up')}/></button>
                            <Duration id='session-label' name="Session" insideId="session-length" defVal={this.state.ss_len}/>
                            <button id ="session-decrement" disabled={this.state.running} onClick={this.sessionMinus.bind(this)}><FontAwesomeIcon icon={solid('arrow-down')}/></button>
                        </div>
                    </div>
                    <div className='container timer'>
                        <div id="timer-label">{timer_label}</div>
                        <div id="time-left">{currentTime}</div>
                        <audio id='beep' src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
                        <button id="start_stop" onClick={this.startCounting}>
                            <FontAwesomeIcon icon={solid('play')}/>
                            <FontAwesomeIcon icon={solid('pause')}/>
                            {/*<FontAwesomeIcon icon={regular('play-pause')}/>*/}
                            <br />Start/stop</button>
                        <button id='reset' onClick={this.reset}><FontAwesomeIcon icon={solid('power-off')}/> <br />Reset</button>
                    </div>
                </main>
                <footer>Coded by Giulia Passoni 2022</footer>
            </div>
        )
    }
}


export default App;
