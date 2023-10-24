import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  TitleStrategy,
} from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  step = 0;
  route!: ActivatedRoute;
  URLtitle!: string;
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  anonymous: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleStrategy: TitleStrategy
  ) {
    this.anonymous = this.authService.anynonimous;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        var rt = this.getChild(this.activatedRoute);
        let string = this.titleStrategy
          .getResolvedTitleForRoute(rt.snapshot)
          .split(' | ')[0];
        this.URLtitle = 'MyCRM - ' + string;
      });
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  async logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['login']);
    });
  }
}
