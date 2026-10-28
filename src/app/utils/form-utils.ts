import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";

  async function sleep() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2500);
    });
  }

export class FormUtils {
  // Nombre y apellido (mínimo 2 palabras)
  static namePattern = /([a-zA-Z]+) ([a-zA-Z]+)/;
  // Formato de correo electrónico
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  // Solo letras y números, sin espacios
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  // Mínimo una mayúscula, una minúscula y un número
  static passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;
  //
  static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';

  static getTextError(errors: ValidationErrors, fieldName?: string): string | null {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mímino de ${errors['minlength'].requiredLength} caracteres`;
        case 'min':
          return `Valor mímino de ${errors['min'].min}`;
        case 'email':
          return `El valor ingresado no es un correo electrónico`;
        case 'emailToken':
          return `El correo electrónico ya está siendo usado por otro usuario`;
        case 'pattern':
          if (fieldName === 'email') return 'El valor ingresado no luce como un correo electrónico';
          if (fieldName === 'password') return 'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número.';
          if (fieldName === 'fullName') return 'El noombre debe contener dos palabras.';

          return 'Error de patrón contra expresion regular';
        default:
          return `Error de validación no controlado ${key}`;
      }
    }
    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors &&
      form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;
    const errors = form.controls[fieldName].errors ?? [];
    return FormUtils.getTextError(errors,fieldName);
  }

  static isValidFieldArray(formArray: FormArray, index: number) {
    return (formArray.controls[index].errors && formArray.controls[index].touched);
  }

  static getFieldErrorInArray(formArray: FormArray, index: number) {
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (FormGroup: AbstractControl) => {
      const field1Value = FormGroup.get(field1)?.value;
      const field2Value = FormGroup.get(field2)?.value;

      if (!field1Value || !field2Value) return null;

      return field1Value === field2Value ? null : { fieldNotEqual: true };
    };
  }

  static hasFormError(form: FormGroup, errorName: string, fieldName?: string) {
    const hasError = form.hasError(errorName);
    if (!hasError) return false;

    // Si se especifica un campo, también debe haber sido tocado
    if (fieldName) return !!form.get(fieldName)?.touched;

    return form.touched;
  }
}
