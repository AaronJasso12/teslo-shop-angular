
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard-layout.html',
})
export class AdminDashboardLayout {
  private router = inject(Router);
  private authSrv = inject(AuthService);

  user = computed(() => this.authSrv.user());

  logout() {
    this.authSrv.logout();
    this.router.navigate(['/']);
  }
}
