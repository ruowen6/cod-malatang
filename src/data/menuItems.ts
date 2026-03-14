import placeholderIcon from '../assets/button-placeholder.png';

export interface MenuItem {
  id: number;
  name: string;
  /** Icon shown on the menu button */
  icon: string;
  /** Icon shown as badge in the bowl */
  bowlIcon: string;
}

export const menuItems: MenuItem[] = [
  { id: 1, name: '芦笋', icon: placeholderIcon, bowlIcon: placeholderIcon },
  { id: 2, name: '大肉-Ghost', icon: placeholderIcon, bowlIcon: placeholderIcon },
  { id: 3, name: '午餐肉', icon: placeholderIcon, bowlIcon: placeholderIcon },
  { id: 4, name: '杏鲍菇', icon: placeholderIcon, bowlIcon: placeholderIcon },
  { id: 5, name: '大肉-König', icon: placeholderIcon, bowlIcon: placeholderIcon },
  { id: 6, name: '娃娃菜', icon: placeholderIcon, bowlIcon: placeholderIcon },
  { id: 7, name: '藕片', icon: placeholderIcon, bowlIcon: placeholderIcon },
  { id: 8, name: '肥牛卷', icon: placeholderIcon, bowlIcon: placeholderIcon },
  { id: 9, name: '玉米', icon: placeholderIcon, bowlIcon: placeholderIcon },
  { id: 10, name: '蟹棒', icon: placeholderIcon, bowlIcon: placeholderIcon },
  { id: 11, name: '煎蛋', icon: placeholderIcon, bowlIcon: placeholderIcon },
  { id: 12, name: '蘑菇', icon: placeholderIcon, bowlIcon: placeholderIcon },
];
