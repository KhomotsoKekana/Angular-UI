import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'classCombine'
})
export class ClassCombinePipe implements PipeTransform {
  transform(baseClass: string, priorityClass: string): string {
    const classString = baseClass.split(' ');
    const priorityClassArray = priorityClass.split(' ');

    // Filter out base classes that have the same prefix as inner classes
    const filteredBaseClasses = classString.filter(baseClass => {
      const prefix = baseClass.split('-')[0];
      return !priorityClassArray.some(innerClass =>
        innerClass.startsWith(prefix) || innerClass.startsWith(`!${prefix}`)
      );
    });

    // Combine filtered base classes with inner classes (with ! prefix)
    return [
      ...filteredBaseClasses,
      ...priorityClassArray.map(cls => cls ? `${cls}` : '').filter(cls => cls)
    ].join(' ');
  }
}