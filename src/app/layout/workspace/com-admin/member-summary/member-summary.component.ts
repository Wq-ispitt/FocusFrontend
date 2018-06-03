import { Component, OnInit } from '@angular/core';
import {SummaryService} from "../../../../service/summary.service";

@Component({
  selector: 'app-member-summary',
  templateUrl: './member-summary.component.html',
  styleUrls: ['./member-summary.component.css']
})
export class MemberSummaryComponent implements OnInit {
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  // Doughnut
  public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData:number[] = [350, 450, 100];
  public doughnutChartType:string = 'doughnut';

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  adminLoc = JSON.parse(localStorage.getItem('curUser')).location;

  memberNum: number;
  blockNum: number;
  familyNum: number;

  constructor(
    private summaryService: SummaryService
  ) { }

  ngOnInit() {
    this.summaryService.getMembersInCommunity(this.adminLoc).subscribe(value =>
      this.memberNum = value
    );
    this.summaryService.getBlocksInCommunity(this.adminLoc).subscribe(value =>
      this.blockNum = value
    );
    this.summaryService.getFamiliesInCommunity(this.adminLoc).subscribe(value =>
      this.familyNum = value
    )
  }


  selected: string;

  features = [
    'Gender',
    'Race',
    'Marry',
    'Education',
    'Employments',
  ];

}
