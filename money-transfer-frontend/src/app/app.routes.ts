// import { Routes } from '@angular/router';
// import { LoginComponent } from './components/auth/login/login.component';
// import { RegisterComponent } from './components/auth/register/register.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
// import { AuthGuard } from './guards/auth.guard';
// import { PaymentInfosComponent } from './components/payment-infos/payment-infos.component';

// export const routes: Routes = [
//   { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   {
//     path: 'dashboard',
//     component: DashboardComponent,
//     canActivate: [AuthGuard],
//   },
//   {
//     path: 'history',
//     component: TransactionHistoryComponent,
//     canActivate: [AuthGuard],
//   },
//   {
//     path: 'payment-infos',
//     component: PaymentInfosComponent,
//     canActivate: [AuthGuard],
//   },
//   { path: '**', redirectTo: '/dashboard' },
// ];
import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
// import { ProfileComponent } from './components/auth/profile.component';
import { PaymentInfosComponent } from './components/payment-infos/payment-infos.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PaymentResultComponent } from './components/payment-result/payment-result.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'page-not-found',
    component: NotFoundComponent,
    data: { showNavbar: false },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { showNavbar: true },
  },
  {
    path: 'payment-result',
    component: PaymentResultComponent,
    canActivate: [AuthGuard],
    data: { showNavbar: true },
  },

  {
    path: 'history',
    component: TransactionHistoryComponent,
    canActivate: [AuthGuard],
    children: [{ path: ':userId', component: TransactionHistoryComponent }],
  },

  // { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'payment-infos',
    component: PaymentInfosComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'payments',
        component: PaymentInfosComponent,
      },
    ],
  },

  { path: '**', redirectTo: '/page-not-found' },
];
