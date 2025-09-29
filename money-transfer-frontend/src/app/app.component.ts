import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = '💸 Money Transfer App';
  showNavbar = true;

  // constructor(private router: Router, private route: ActivatedRoute) {
  //   this.router.events
  //     .pipe(
  //       filter((event) => event instanceof NavigationEnd),
  //       map(() => {
  //         let child = this.route.firstChild;
  //         while (child?.firstChild) {
  //           child = child.firstChild;
  //         }
  //         return child?.snapshot.data['showNavbar'] !== false;
  //       })
  //     )
  //     .subscribe((show: any) => (this.showNavbar = show));
  // }

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const deepestChild = this.getDeepestChild(this.route);
        this.showNavbar = deepestChild.snapshot.data['showNavbar'] !== false;
      });
  }

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    let child = route.firstChild;
    while (child?.firstChild) {
      child = child.firstChild;
    }
    return child ?? route;
  }
}
