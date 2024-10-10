import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MenuItem } from '../../models/menu-item.interface';
import { IPermissions, ScreenPermissions } from '../../enums/permissions.enum';
import { CommonModule } from '@angular/common';
import { filter, Subject, takeUntil } from 'rxjs';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ItemsService } from '../../services/items.service';

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
  private readonly destroy$ = new Subject<void>();
  loading = false;
  collapsed = false;
  menu: MenuItem[] = [
    {
      title: 'Item 1',
      children: [],
      id: '1'
    },
    {
      title: 'Item 2',
      children: [],
      id: '2'
    },
    {
      title: 'Item 3',
      children: [],
      id: '3'
    },
    {
      title: 'Item 4',
      children: [],
      id: '4'
    },
    {
      title: 'Item 5',
      children: [],
      id: '5'
    },
    {
      title: 'Item 6',
      children: [],
      id: '6'
    },
    {
      title: 'Item 7',
      children: [],
      id: '7'
    },
    {
      title: 'Item 8',
      children: [],
      id: '8'
    },
    {
      title: 'Item 9',
      children: [],
      id: '9'
    },
    {
      title: 'Item 10',
      children: [],
      id: '10'
    },
    {
      title: 'Item 11',
      children: [],
      id: '11'
    },
    {
      title: 'Item 12',
      children: [],
      id: '12'
    },
    {
      title: 'Item 13',
      children: [],
      id: '13'
    }
  ]
  isMenuLoaded: boolean = false;

  constructor(
    private router: Router,
    private items: ItemsService
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

  toggleMenuItem(menuItem: MenuItem) {
    if (menuItem.loadedChildren) {
      menuItem.expanded = !menuItem.expanded;
      if (!menuItem.expanded) {
        this.collapseChildren(menuItem);
      }
      return;
    }
    this.loading = true;
    this.items.getItems(menuItem).pipe(takeUntil(this.destroy$)).subscribe({
      next: (children) => {
        menuItem.children = children;
        this.loading = false;
        menuItem.expanded = true;
        menuItem.loadedChildren = true;
      }
    })
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

  collapseChildren(menuItem: MenuItem): void {
    menuItem.children?.forEach(e => {
      e.expanded = false;
      if (e.children?.length) {
        this.collapseChildren(e);
      }
    })
  }

  collapseAll(): void {
    this.collapsed = !this.collapsed;
  }
}