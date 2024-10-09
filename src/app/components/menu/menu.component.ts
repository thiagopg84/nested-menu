import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MenuItem } from '../../models/menu-item.interface';
import { IPermissions, ScreenPermissions } from '../../enums/permissions.enum';
import { CommonModule } from '@angular/common';
import { filter, Subject, takeUntil } from 'rxjs';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  animations: [
    trigger('slideToggle', [
      state('closed', style({
        height: '0px',
        opacity: 1,
      })),
      state('open', style({
        height: '*',
        opacity: 1
      })),
      transition('closed <=> open', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
  destroy$ = new Subject<void>();
  menu: MenuItem[] = [
    {
      title: 'DASHBOARD',
      icon: 'browser-outline',
      link: 'dashboard'
    },
    {
      title: 'RESOURCE',
      icon: 'layers-outline',
      children: [
        {
          title: 'TENANTS',
          children: [
            {
              title: 'CAMERAS',
            },
            {
              title: 'HOME',
              link: '/home',
              data: ScreenPermissions.VIEW_HOME,
            },
          ],
        },
        {
          title: 'CAMERAS',
          link: '/resource/cameras',
          data: IPermissions.LIST_CAMERAS,
        },
        {
          title: 'STRUCTURE_ITEMS',
          link: '/resource/structure-items',
          data: IPermissions.LIST_STRUCTURE_ITEMS,
        },
        {
          title: 'CONTRACTS',
          link: '/resource/contracts',
          data: IPermissions.LIST_CONTRACTS,
        },
      ],
    },
    {
      title: 'CONFIGURATION',
      icon: 'settings-outline',
      children: [
        {
          title: 'HIERARCHY',
          link: '/config/structures',
          data: IPermissions.ADD_STRUCTURES,
        },
        {
          title: 'SERVERS',
          link: '/config/servers',
          data: IPermissions.LIST_SERVERS,
        },
        {
          title: 'IMPLANTATION',
          link: '/config/implantation',
          data: ScreenPermissions.VIEW_IMPLANTATION,
        },
        {
          title: 'GENERAL_PARAMS',
          link: '/config/general-params',
          data: 'viewGeneralParams',
        },
        {
          title: 'SYSTEM',
          link: '/config/system',
          data: IPermissions.CONFIGURE_WHITELABEL,
        },
        {
          title: 'CUSTOMIZATION',
          link: '/config/customization',
          data: IPermissions.CONFIGURE_WHITELABEL,
        },
        {
          title: 'CONTRACT_TEMPLATES',
          link: '/config/contract-templates',
          data: IPermissions.LIST_CONTRACT_TEMPLATES,
        },
        {
          title: 'PROFILES',
          link: '/config/profiles',
          data: IPermissions.LIST_PROFILES,
        },
        {
          title: 'USERS',
          link: '/config/users',
          data: IPermissions.LIST_USERS,
        },
      ],
    },
  ];
  isMenuLoaded: boolean = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentRoute();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCurrentRoute(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.openMenusForActiveRoute(this.menu, event.url);
      });
  }

  toggleMenuItem(menuItem: any) {
    menuItem.expanded = !menuItem.expanded;
  }

  openMenusForActiveRoute(menuItems: MenuItem[], currentUrl: string): void {
    for (const item of menuItems) {
      if (item.link === currentUrl) {
        item.expanded = true;
      } else if (item.children) {
        this.openMenusForActiveRoute(item.children, currentUrl);
        if (item.children.some(child => child.expanded)) {
          item.expanded = true;
        }
      }
    }
  }
}