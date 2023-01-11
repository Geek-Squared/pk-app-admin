import { Component, OnInit } from '@angular/core';
import { Model } from 'survey-core';
@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss'],
})
export class CreateSurveyComponent implements OnInit {
  surveyModel: Model;
  constructor() {}

  ngOnInit(): void {
    const survey = new Model({
      elements: [
        {
          name: 'FirstName',
          title: 'Enter your first name:',
          type: 'text',
        },
        {
          name: 'LastName',
          title: 'Enter your last name:',
          type: 'text',
        },
      ],
    });
    this.surveyModel = survey;
  }
}
