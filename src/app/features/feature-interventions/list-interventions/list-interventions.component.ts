import { Component, Input, OnInit } from '@angular/core';
import { Intervention } from 'src/app/models/intervention.interface';
import { InterventionsService } from 'src/app/services';

@Component({
  selector: 'app-list-interventions',
  templateUrl: './list-interventions.component.html',
  styleUrls: ['./list-interventions.component.scss'],
})
export class ListInterventionsComponent implements OnInit {
  @Input() categoryId: string;
  public isCreate: boolean;
  public interventions: Intervention[];
  public isLoading: boolean;

  constructor(private interventionsService: InterventionsService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.interventionsService
      .getInterventionsByCategoryId(this.categoryId)
      .subscribe(
        (data) => {
          this.interventions = data.map((e: any) => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data(),
            } as Intervention;
          });

          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }
}
