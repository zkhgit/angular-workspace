import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { 
    debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../service/hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private heroService: HeroService
  ) { }

  ngOnInit() {
    this.heroes$ = this.searchTerms
      .pipe(
        // wait 300ms after each keystroke before considering the term
        debounceTime(300),
        // 会确保只在过滤条件变化时才发送请求
        distinctUntilChanged(),
        // switch to new search observable each time the term changes
        switchMap((term: string) => this.heroService.searchHeroes(term))
      );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
