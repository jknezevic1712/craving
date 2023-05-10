import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  // @Output() featureSelected = new EventEmitter<string>();
  collapsed = true;

  private userSub: Subscription;
  isLoggedIn = false;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      // this.isLoggedIn = !user ? false : true;
      this.isLoggedIn = !!user; // Shortened syntax, so if !user === true, so no user then it will actually return false because of the extra !. Also, if the !user === false, it means there is a user and then the ! will make it true.
    });
  }

  // onSelect(feature: string) {
  //   this.featureSelected.emit(feature);
  // }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.signOut();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
