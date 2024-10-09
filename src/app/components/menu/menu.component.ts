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

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
  destroy$ = new Subject<void>();
  currentRoute: string = '';
  currentLink!: MenuItem;
  menu: MenuItem[] = [
    {
      title: 'DASHBOARD',
      icon: 'browser-outline',
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
    private router: Router,
    private element: ElementRef,
    private renderer: Renderer2
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
        this.currentRoute = event.url;
        this.createIdsForMenuItems();
        this.getCurrentLink();
      });
  }

  getCurrentLink(): void {
    const findLink = (menuItems: MenuItem[]): MenuItem | undefined => {
      for (let item of menuItems) {
        if (item.link === this.currentRoute) return item;

        if (item.children) {
          let menuItem: MenuItem | undefined = findLink(item.children);
          if (menuItem) return menuItem;
        }
      }
      return undefined;
    };
    const currentLink = findLink(this.menu);
    if (currentLink) {
      this.currentLink = currentLink;

      setTimeout(() => {
        this.openParentsAndClick(currentLink);
      }, 0);
    }
  }

  openParentsAndClick(currentLink: MenuItem): void {
    const pathToLink: MenuItem[] = this.getPathToLink(this.menu, currentLink);
    let parentElement: HTMLElement | null = null;
    pathToLink.forEach((menuItem, index) => {
      if (index === 0) {
        parentElement = this.element.nativeElement.querySelector(
          `[data-link="${menuItem.id}"]`
        ) as HTMLElement;
      } else {
        parentElement = parentElement?.nextElementSibling?.querySelector(
          `[data-link="${menuItem.id}"]`
        ) as HTMLElement;
      }
      if (parentElement) {
        const ulElementRef = parentElement.nextElementSibling as HTMLElement;
        if (ulElementRef && ulElementRef.tagName === 'UL') {
          ulElementRef.classList.add('active');
          ulElementRef.style.maxHeight = `${ulElementRef.scrollHeight}px`;
        }
      }
    });
  }

  getPathToLink(menuItems: MenuItem[], targetLink: MenuItem): MenuItem[] {
    for (let item of menuItems) {
      if (item.id === targetLink.id) return [item];

      if (item.children) {
        let childPath = this.getPathToLink(item.children, targetLink);
        if (childPath.length) return [item, ...childPath];
      }
    }
    return [];
  }

  handleLinkClick(menuItemRef: HTMLElement, menuItem: MenuItem) {
    if (menuItem.children) {
      const ulElementRef = menuItemRef.nextElementSibling;
      if (!ulElementRef) return;
      const classList = ulElementRef?.classList;
      if (!classList.contains('active')) {
        classList.add('active');
        const scrollHeight = (ulElementRef as any).scrollHeight;
        (ulElementRef as any)['style'] = `max-height: ${scrollHeight}px`;
      } else {
        classList.remove('active');
        (ulElementRef as any)['style'] = '';
      }
    }
  }

  createIdsForMenuItems(): void {
    const iterator = (menuItems: MenuItem[]) => {
      menuItems.map((item) => {
        item.id = this.generateId();
        if (item.children?.length) iterator(item.children);
        return item;
      });
      return menuItems;
    };
    this.menu = iterator(this.menu);
    this.isMenuLoaded = true;
  }

  generateId(): string {
    return `item_${Math.random().toString(16).slice(2)}`;
  }
}
