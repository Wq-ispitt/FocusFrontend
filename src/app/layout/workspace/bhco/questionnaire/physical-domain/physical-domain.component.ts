import {Component, Input, OnInit} from '@angular/core';
import {Answer, Domain, Session} from '../../../../../model/questionBase';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {QuestionModelService} from "../../../../../service/question-model.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-physical-domain',
  templateUrl: './physical-domain.component.html',
  styleUrls: ['./physical-domain.component.css']
})
export class PhysicalDomainComponent implements OnInit {
  @Input() domain: Domain;

  member = JSON.parse(localStorage.getItem('curMem'));
  curDom: string;
  questions: any;
  subdomainList: any[];
  form: FormGroup;
  answers: Answer[] = [];
  finalAns: SessionAns[] = [];
  isLinear: true;
  payLoad = '';

  sessionDate = null;
  curDate = Date.now();
  returnValue: any;
  isSubmitted : boolean = false;

  constructor(
    private route: ActivatedRoute,
    private queService: QuestionModelService,
    private fb: FormBuilder,
    private datePipe: DatePipe
    ) {}

  ngOnInit() {
    this.form = this.fb.group({});
    this.getQuestionByDom();
  }

  getQuestionByDom() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.queService.getQuesByDomain(id).subscribe(value => {
      this.questions = value;
      this.curDom = this.questions.selectedDomain.domain;
      this.subdomainList = this.questions.resultSubDomains;
      this.toFormGroup(this.subdomainList);
    });
  }

  // construct form group for domain
   toFormGroup(subdomList: any[]) {
     let group: any = {};
     subdomList.forEach(sub => {
         group[sub.subdomain] = this.toFormQuesGroup(sub);
     });
     this.form = this.fb.group(group);
    }

    // construct form group for subdomain
   toFormQuesGroup(questions: any) {
      let ques = questions.questionnaire;
      let group: any = {};
     ques.forEach(que => {
       group[que.id] = [''];
       //record the answers in an array with corresponding question id
       const ans = new Answer({questionid: que.id, domain: this.curDom, weight: que.weight});
       this.answers.push(ans);
     });
     let subForm = this.fb.group(group);
     //bind the answer array when form value get changed
     this.answers.forEach(ansItem => {
       subForm.controls[ansItem.questionid].valueChanges.subscribe(value => {
         ansItem.answer = value;
         // get the answer point
         ques.forEach(que => {
           if (que.id === ansItem.questionid) {
             que.options.forEach(opt => {
                if (opt.value === ansItem.answer) {
                  ansItem.point = opt.point;
                }
             })
           }
         })
       });
     });
     return subForm;
   }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
    console.log(this.answers);
    this.sessionDate = this.datePipe.transform(this.curDate, "yyyy-MM-dd HH:mm a z':'+0900");
    // convert the answer array to the right array format
    this.answers.forEach(ans => {
      const ansSession = new SessionAns({
        questionid: ans.questionid,
        answer: {answer: ans.answer, point: ans.point},
        domain: ans.domain,
        weight: ans.weight,
      });
      this.finalAns.push(ansSession);
    });
    const session = new Session({
      userid: this.member.id,
      answer: this.finalAns,
      createdate: this.sessionDate,
    });
    console.log(session);
    //post the value to the back end
    this.queService.addUserAnswer(session).subscribe(value => this.returnValue = value);
    this.isSubmitted = true;
  }
}

// session answer class defined for calculate point
export class SessionAns {
  questionid: number;
  answer: any;
  domain: string;
  weight: number;
  constructor(options: {
    questionid?: number,
    answer?: any,
    domain?: string,
    weight?: number,
  } = {}) {
    this.questionid = options.questionid;
    this.answer = options.answer;
    this.domain = options.domain;
    this.weight = options.weight;
  }
}
