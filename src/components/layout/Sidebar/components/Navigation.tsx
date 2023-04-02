import { cx } from '@emotion/css';
import { clomp } from 'clomp';
import { useMemo } from 'react';
import { IconType } from 'react-icons';
import { useLocation } from 'react-router-dom';
import { IPropsOf } from 'types.d';

const Box = clomp.div`
  flex
  items-center
  gap-2
  border-l-4
  border-transparent
  px-6
  py-4
  hover:font-semibold
`;

export interface INavigationItem {
  /**
   * Icon that will be rendered on the left side of the navigation item.
   */
  icon: IconType;
  /**
   * Label that will describe the navigation item.
   */
  label: string;
  /**
   * Route to redirect on click events.
   */
  to: string;
}

export type INavigationProps = IPropsOf<'div'> & INavigationItem;

export const Navigation: React.FC<INavigationProps> = ({
  icon: Icon,
  label,
  to,
  ...rest
}): JSX.Element => {
  const location = useLocation();

  const isSelected = useMemo(() => location?.pathname === to, [location, to]);

  return (
    <Box className={cx({ '!border-[#384967]': isSelected })} {...rest}>
      <Icon />
      <p className={cx('flex-1 text-sm', { 'font-bold': isSelected })}>
        {label}
      </p>
    </Box>
  );
};
