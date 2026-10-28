
import { Component, computed, effect, input, OnInit, signal } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.html',
})
export class FormErrorLabel {
  control = input.required<AbstractControl>();

  private controlStatus = signal(0);

  messageEffect =  effect((onCleanup) => {
    const control = this.control();

    const subscription = control.events.subscribe(() => {
      this.controlStatus.update(value => value + 1);
    });

    onCleanup(() => subscription.unsubscribe());
  });

  errorMessage = computed(() => {
    this.controlStatus();

    const control = this.control();
    const errors: ValidationErrors = control.errors ?? {};

    return control.touched && Object.keys(errors).length > 0
      ? FormUtils.getTextError(errors)
      : null;
  });

  // get errorMessage() {
  //   const errors: ValidationErrors = this.control().errors || {};
  //   console.log({errors});

  //   return this.control().touched && Object.keys(errors).length > 0
  //     ? FormUtils.getTextError(errors)
  //     : null;
  // }
}
