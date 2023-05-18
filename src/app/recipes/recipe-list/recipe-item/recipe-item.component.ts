import { Component, Input } from '@angular/core';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
  group,
} from '@angular/animations';

import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
  animations: [
    // trigger('list1', [
    //   state(
    //     'in',
    //     style({
    //       opacity: 1,
    //       transform: 'translateX(0)',
    //     })
    //   ),
    //   transition('void => *', [
    //     style({
    //       opacity: 0,
    //       transform: 'translateX(-100px)',
    //     }),
    //     animate(300),
    //   ]),
    //   transition('* => void', [
    //     animate(
    //       300,
    //       style({
    //         transform: 'translateX(100px)',
    //         opacity: 0,
    //       })
    //     ),
    //   ]),
    // ]),
    trigger('list2', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition('void => *', [
        animate(
          1000,
          keyframes([
            style({
              transform: 'translateX(-100px)',
              opacity: 0,
              offset: 0,
            }),
            style({
              transform: 'translateX(-50px)',
              opacity: 0.5,
              offset: 0.3,
            }),
            style({
              transform: 'translateX(-20px)',
              opacity: 1,
              offset: 0.8,
            }),
            style({
              transform: 'translateX(0px)',
              opacity: 1,
              offset: 1,
            }),
          ])
        ),
      ]),
      transition('* => void', [
        group([ // group allows you to run multiple animation that run at diff timings at the same time
          animate(
            300,
            style({
              transform: 'translateX(100px)',
              opacity: 0,
            })
          ),
          animate(
            800,
            style({
              backgroundColor: 'red',
            })
          ),
        ]),
      ]),
    ]),
  ],
})
export class RecipeItemComponent {
  @Input() recipe: Recipe;
  @Input() index: number;
}
