import type { BaseLibItems } from '../../typing';

export const BG_REPEAT: BaseLibItems = [
  { label: '不重复', value: 'no-repeat' },
  { label: '重复铺满', value: 'repeat' },
];

export const BG_SIZE: BaseLibItems = [
  {
    label: '自适应',
    value: 'contain',
    children: [
      { label: '居上', value: 'top', children: BG_REPEAT },
      { label: '居中', value: 'center', children: BG_REPEAT },
      { label: '居下', value: 'bottom', children: BG_REPEAT },
    ],
  },
  {
    label: '拉伸',
    value: 'cover',
    children: [
      { label: '居上', value: 'top' },
      { label: '居中', value: 'center' },
      { label: '居下', value: 'bottom' },
    ],
  },
];
