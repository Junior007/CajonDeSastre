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
