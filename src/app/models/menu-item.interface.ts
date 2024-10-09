export interface MenuItem {
  title: string;
  link?: string;
  icon?: string;
  url?: string;
  expanded?: boolean;
  target?: string;
  hidden?: boolean;
  group?: boolean;
  selected?: boolean;
  children?: MenuItem[];
  data?: string;
  id?: string;
}
