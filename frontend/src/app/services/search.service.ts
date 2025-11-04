import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  private searchExecutedSubject = new BehaviorSubject<boolean>(false);
  
  public searchTerm$ = this.searchTermSubject.asObservable();
  public searchExecuted$ = this.searchExecutedSubject.asObservable();

  constructor() { }

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
    this.searchExecutedSubject.next(true); // Marcar que se ejecutó una búsqueda
  }

  getSearchTerm(): string {
    return this.searchTermSubject.value;
  }

  isSearchExecuted(): boolean {
    return this.searchExecutedSubject.value;
  }

  clearSearch(): void {
    this.searchTermSubject.next('');
    this.searchExecutedSubject.next(false); // Marcar que no hay búsqueda activa
  }
}