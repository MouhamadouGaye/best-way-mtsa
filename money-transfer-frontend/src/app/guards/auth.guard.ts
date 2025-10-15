import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, catchError, of, delay, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      map((user) => {
        if (user) return true; // ✅ user exists → allow access
        this.router.navigate(['/login']); // ❌ no user → redirect
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/login']); // ❌ error (e.g., 401) → redirect
        return of(false);
      })
    );
  }
}
