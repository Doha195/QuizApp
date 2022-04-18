import { Component, OnInit } from '@angular/core';
import { interval, timeout } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  public name : string="";
  public questionList : any = [];
  public currentQuestion:number = 0;
  public points: number = 0;
  dejaRe : boolean = false;
  counter=300;
  correctAnswer:number = 0;
  interval$:any;
  progress:string="0";
  isQuizCompleted : boolean = false;
  constructor(private questionService : QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }
  getAllQuestions(){
    this.questionService.getQuestionJson()
    .subscribe(res =>{
      this.questionList = res.questions;
    })
  }
  nextQuestion(){
    this.currentQuestion++;
  }
  previousQuestion(){
    this.currentQuestion--;
  }
  answer(currentQno:number,option:any){

    if(currentQno === this.questionList.length) {
      this.isQuizCompleted = true;
      this.stopCounter();
    }

    if(option.correct){
      this.points+=20;
      this.correctAnswer++;
      setTimeout(() => {
        this.currentQuestion++;
        this.getProgressPercent();
        this.dejaRe = true
      }, 1000);

    }else{
      setTimeout(() => {
        this.dejaRe = true
        this.currentQuestion++;
      }, 1000)
    }
  }
  startCounter(){
    this.interval$ = interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter===0){
        this.currentQuestion++;
        this.counter=300;
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter=300;
    this.startCounter();
  }
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points=0;
    this.counter=300;
    this.currentQuestion=0;
    this.progress="0";
  }
  getProgressPercent(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }

}
