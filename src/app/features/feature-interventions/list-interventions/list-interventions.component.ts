import { Component, HostListener, OnInit } from '@angular/core';
import { Intervention } from 'src/app/models/intervention.interface';
import { InterventionsService } from 'src/app/services';

@Component({
  selector: 'app-list-interventions',
  templateUrl: './list-interventions.component.html',
  styleUrls: ['./list-interventions.component.scss'],
})
export class ListInterventionsComponent implements OnInit {
  public isCreate: boolean;
  public isUpdate: boolean;
  public interventions: Intervention[];
  public isLoading: boolean;
  public openMenuId: string | null = null;
  public selectedIntervention: Intervention | null = null;

  constructor(private interventionsService: InterventionsService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.interventionsService.getInterventions().subscribe(
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

  @HostListener('document:click')
  handleDocumentClick() {
    this.openMenuId = null;
  }

  toggleMenu(intervention: Intervention, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!intervention?.id) {
      return;
    }
    this.openMenuId =
      this.openMenuId === intervention.id ? null : intervention.id;
  }

  openEdit(intervention: Intervention, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!intervention) {
      return;
    }

    this.selectedIntervention = intervention;
    this.isUpdate = true;
    this.openMenuId = null;
  }

  deleteIntervention(intervention: Intervention, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!intervention?.id) {
      return;
    }

    const name = intervention?.name ? `"${intervention.name}"` : 'this intervention';
    const confirmed = window.confirm(
      `Delete ${name}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.interventionsService.deleteIntervention(intervention.id).catch(() => {});
    this.openMenuId = null;
  }
}
