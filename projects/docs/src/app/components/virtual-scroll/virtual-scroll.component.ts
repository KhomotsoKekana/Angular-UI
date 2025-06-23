import { Component } from '@angular/core';
import { VirtualScrollPaginatorComponent } from '../../../../../ui/src/lib/virtual-scroll/virtual-scroll.component';
import { CodeBlockComponent } from '../../../../../ui/src/lib/code-block/code-block.component';

@Component({
  selector: 'app-virtual-scroll',
  imports: [VirtualScrollPaginatorComponent,CodeBlockComponent],
  templateUrl: './virtual-scroll.component.html',
})
export class VirtualScrollComponent {
    private fruits = [
    'Apple', 'Banana', 'Mango', 'Pineapple', 'Peach', 'Kiwi', 'Watermelon', 'Blueberry', 'Raspberry', 'Cherry', 'Avocado',
    'Lemon', 'Lime', 'Coconut', 'Pear', 'Plum', 'Apricot'
  ];

  //private currentIndex = 0;
  stuff = this.fruits.slice(0, 10).map(name => ({ name }));
  hasMoreItems = this.fruits.length > this.stuff.length;

  async loadMoreItems(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const nextBatch = this.fruits.slice(this.stuff.length, this.stuff.length + 5)
          .map(name => ({ name }));
        this.hasMoreItems = this.stuff.length + nextBatch.length < this.fruits.length;
        resolve(nextBatch);
      }, 1000);
    });
  }

  handleItemClick(item: any) {
    console.log('Clicked fruit:', item);
  }

}
