import btn01 from '../assets/buttons/01-krueger-lusun.png';
import btn02 from '../assets/buttons/02-ghost-shrimp.png';
import btn03 from '../assets/buttons/03-ghost-meat.png';
import btn04 from '../assets/buttons/04-konig-mushroom.png';
import btn05 from '../assets/buttons/05-konig-meat.png';
import btn06 from '../assets/buttons/06-konig-vege.png';
import btn07 from '../assets/buttons/07-keegan-lotus.png';
import btn08 from '../assets/buttons/08-keegan-beef.png';
import btn09 from '../assets/buttons/09-keegan-corn.png';
import btn10 from '../assets/buttons/10-nikto-crab.png';
import btn11 from '../assets/buttons/11-krueger-egg.png';
import btn12 from '../assets/buttons/12-nikto-mushroom.png';

import bowl01 from '../assets/bowl_icons/01-krueger-lusun.png';
import bowl02 from '../assets/bowl_icons/02-ghost-shrimp.png';
import bowl03 from '../assets/bowl_icons/03-ghost-meat.png';
import bowl04 from '../assets/bowl_icons/04-konig-mushroom.png';
import bowl05 from '../assets/bowl_icons/05-konig-meat.png';
import bowl06 from '../assets/bowl_icons/06-konig-vege.png';
import bowl07 from '../assets/bowl_icons/07-keegan-lotus.png';
import bowl08 from '../assets/bowl_icons/08-keegan-beef.png';
import bowl09 from '../assets/bowl_icons/09-keegan-corn.png';
import bowl10 from '../assets/bowl_icons/10-nikto-crab.png';
import bowl11 from '../assets/bowl_icons/11-krueger-egg.png';
import bowl12 from '../assets/bowl_icons/12-nikto-mushroom.png';

export interface MenuItem {
  id: number;
  name: string;
  /** Icon shown on the menu button */
  icon: string;
  /** Icon shown as badge in the bowl */
  bowlIcon: string;
}

export const menuItems: MenuItem[] = [
  { id: 1, name: 'Krueger脆脆芦笋', icon: btn01, bowlIcon: bowl01 },
  { id: 2, name: 'Q弹大虾Ghost', icon: btn02, bowlIcon: bowl02 },
  { id: 3, name: 'Ghost午餐肉', icon: btn03, bowlIcon: bowl03 },
  { id: 4, name: 'König杏鲍菇', icon: btn04, bowlIcon: bowl04 },
  { id: 5, name: 'König大口吃肉', icon: btn05, bowlIcon: bowl05 },
  { id: 6, name: '娃娃菜König', icon: btn06, bowlIcon: bowl06 },
  { id: 7, name: '脆脆藕片Keegan', icon: btn07, bowlIcon: bowl07 },
  { id: 8, name: '香喷喷肥牛卷Keegan', icon: btn08, bowlIcon: bowl08 },
  { id: 9, name: '玉米Keegan', icon: btn09, bowlIcon: bowl09 },
  { id: 10, name: '蟹棒Nikto', icon: btn10, bowlIcon: bowl10 },
  { id: 11, name: '煎蛋Krueger', icon: btn11, bowlIcon: bowl11 },
  { id: 12, name: '蘑菇Nikto', icon: btn12, bowlIcon: bowl12 },
];
