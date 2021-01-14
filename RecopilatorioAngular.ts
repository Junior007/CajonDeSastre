//Devuelve las claves de propiedades con distinto valor de dos objetos
	checkDiferencesInObjects(obj1: any, obj2: any): string[] {

		let Keys1 = Object.keys(obj1).sort();
		//let Keys2 = Object.keys(obj2).sort();
		let keysToReturn: string[] = [];
		Keys1.forEach((value, index, array) => {

			if (obj1[value] != obj2[value]) {
				keysToReturn.push(value);
			}

		});

		return keysToReturn;
	}
//Pipes
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return value.chartAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }

}
//
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "formatIfDate"
})
export class FormatIfDate implements PipeTransform {
	month: string;
	day: string;
	year: string;
	myDate: Date;

	transform(value: any): any {

		this.myDate = new Date(value);

		if (
			value == null ||
			typeof value === "boolean" ||
			isNaN(this.myDate.getDate()) ||
			!isNaN(value)
		) {
			return value;
		} else {
			this.month = "0" + (this.myDate.getMonth() + 1);
			this.day = "0" + this.myDate.getDate();
			this.year = "" + this.myDate.getFullYear();

			this.day = this.day.substr(this.day.length - 2);
			this.month = this.month.substr(this.month.length - 2);

			return this.day + "/" + this.month + "/" + this.year;
		}
	}
}

