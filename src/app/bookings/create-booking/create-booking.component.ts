import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/places.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f', { static: true }) form: NgForm;
  showPickerTo = false;
  showPickerFrom = false;
  dateFrom = '';
  dateTo = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if (this.selectedMode === 'random') {
      this.dateFrom = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availableFrom.getTime())
      ).toISOString();

      this.dateTo = new Date(
        new Date(this.dateFrom).getTime() +
          Math.random() *
            (new Date(this.dateFrom).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.dateFrom).getTime())
      ).toISOString();
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel', 'selectedPlace');
  }

  onBookPlace(f: NgForm) {
    if (!this.form.valid || !this.datesValid) {
      return;
    }
    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.form.value['first-name'],
          lastName: this.form.value['last-name'],
          guestNumber: this.form.value['guest-number'],
          startDate: new Date(this.dateFrom),
          endDate: new Date(this.dateTo),
        },
      },
      'confirm'
    );
  }

  datesValid() {
    const startDate = new Date(this.dateFrom);
    const endDate = new Date(this.dateTo);
    return endDate > startDate;
  }

  dateChange($event, type: string) {
    if (type === 'from') {
      this.showPickerFrom = !this.showPickerFrom;
      this.dateFrom = $event.detail.value;

      if (
        this.dateTo &&
        new Date(this.dateFrom).getTime() > new Date(this.dateTo).getTime()
      ) {
        this.dateTo = '';
      }
      this.showPickerTo = !this.showPickerTo;
    }
    if (type === 'to') {
      this.showPickerTo = !this.showPickerTo;
      this.dateTo = $event.detail.value;
    }
  }

  pickerClick(type: string) {
    if (type === 'from') {
      this.showPickerFrom = !this.showPickerFrom;
      this.showPickerTo = false;
    }
    if (type === 'to') {
      this.showPickerTo = !this.showPickerTo;
      this.showPickerFrom = false;
    }
  }

  closePicker() {
    if (this.showPickerFrom) {
      this.showPickerFrom = false;
    }
    if (this.showPickerTo) {
      this.showPickerTo = false;
    }
  }
}
