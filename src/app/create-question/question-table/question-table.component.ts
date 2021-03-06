import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {DemoQuestion, Domain, Question, Questionnare, Subdomain} from "../../model/questionBase";
import {QuestionModelService} from "../../service/question-model.service";

@Component({
  selector: 'app-question-table',
  templateUrl: './question-table.component.html',
  styleUrls: ['./question-table.component.css']
})
export class QuestionTableComponent implements OnInit {
  displayedColumns1 = ['order', 'label', 'quesType', 'options'];
  dataSource1 = null;

  displayedColumns2 =['order', 'label', 'domain', 'subdomain', 'weight', 'quesType', 'options'];
  dataSource2 = null;

  @ViewChild(MatPaginator) paginator1: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;
  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild(MatSort) sort2: MatSort;

  demoQues: DemoQuestion[];
  questionnaire: Questionnare[];

  constructor(private quesService: QuestionModelService) { }

  ngOnInit() {
  }

  getQuestionnaire() {
    this.quesService.getQuestionnaire()
      .subscribe(ques => {
        this.questionnaire = ques;
        this.dataSource2 = new MatTableDataSource(this.questionnaire);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
      });
  }

  getDemoQues() {
    this.quesService.getDemoQsuestions()
      .subscribe(ques =>
      {
        this.demoQues = ques;
        this.dataSource1 = new MatTableDataSource(this.demoQues);
        this.dataSource1.paginator = this.paginator1;
        this.dataSource1.sort = this.sort1;
      });
  }


  ngAfterViewInit() {
    this.getDemoQues();
    this.getQuestionnaire();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource1.filter = filterValue;
    this.dataSource2.filter = filterValue;
  }
}
