import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, {initialValue: 0});
  // interval = signal(0);
  // doubleInterval = computed(() => this.interval() * 2);
  customInterval$ = new Observable((subscriber)=> {
    let timesExecuted = 0;
    const interval = setInterval(() => {
      // subscriber.error('An error occurred!');
      if(timesExecuted > 3){
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      console.log('Emitting New Value... ');
      subscriber.next({message: 'New Value'});
      timesExecuted++;
    }, 2000)
  });
  private destroyRef = inject(DestroyRef);

  constructor() {
    // effect(() => {
    //   console.log(`Clicked Button ${this.clickCount()} times`);
    // })
    
  }
  ngOnInit(): void {
    // setInterval(() => {
    //     this.interval.update(prev => prev + 1);
    // }), 1000
      // const subscription = interval(1000).pipe(
      //   map((val) => val * 2)
      // ).subscribe({
      //   next: (val) => console.log(val)
      // });

      // this.destroyRef.onDestroy(() => {
      //   subscription.unsubscribe();
      // })
      this.customInterval$.subscribe({
        next: (val) => console.log(val),
        complete: () => console.log('Completed!'),
        error: (err) => console.log('Error: ', err)
      })
      const subscription = this.clickCount$.subscribe({
        next: (val) => console.log(`Clicked Button ${this.clickCount()} times`)
      });

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      })
  }

  onClick(){
    this.clickCount.update(prevCount => prevCount + 1);
  }

}
