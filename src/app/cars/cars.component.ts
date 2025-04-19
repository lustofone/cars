import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";

@Component({
  selector: "app-cars",
  imports: [ReactiveFormsModule],
  templateUrl: "./cars.component.html",
  styleUrl: "./cars.component.css",
})
export class CarsComponent {
  http = inject(HttpClient);
  cars: any = [];
  carsFilter = [
    {
      active: true,
      name: "Все марки",
    },
    {
      active: false,
      name: "Lamborghini",
    },
    {
      active: false,
      name: "Ferrari",
    },
    {
      active: false,
      name: "Porsche",
    },
    {
      active: false,
      name: "BMW",
    },
    {
      active: false,
      name: "Mercedes",
    },
    {
      active: false,
      name: "Chevrolet",
    },
    {
      active: false,
      name: "Audi",
    },
    {
      active: false,
      name: "Ford",
    },
  ];
  orderForm = new FormGroup({
    car: new FormControl(""),
    name: new FormControl(""),
    phone: new FormControl("", this.phoneValidator()),
  });
  ngOnInit() {
    this.getCars("");
  }

  getCars(filter: string) {
    return this.http
      .get("https://testologia.ru/cars-data", {
        params: { filter: filter },
      })
      .subscribe((data) => (this.cars = data));
  }

  changeFilter(filter: any, carsContent: HTMLElement) {
    this.carsFilter.forEach((el) => (el.active = false));
    filter.active = true;
    this.getCars(filter.name);
    carsContent.scrollIntoView({ behavior: "instant" });
  }
  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phoneRegex =
        /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
      const valid = phoneRegex.test(control.value);
      return valid ? null : { invalidPhone: true };
    };
  }
  isError(fieldName: string) {
    const control = this.orderForm.get(fieldName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }
  sendOrder() {
    if (this.orderForm.valid) {
      this.http
        .post("https://testologia.ru/cars-order", this.orderForm.value)
        .subscribe({
          next: (responce: any) => {
            alert(responce.message);
            this.orderForm.reset();
          },
          error: (responce: any) => {
            alert(responce.error.message);
          },
        });
    }
  }
}
