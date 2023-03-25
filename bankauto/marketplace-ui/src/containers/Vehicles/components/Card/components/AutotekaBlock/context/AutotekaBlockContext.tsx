import React, { memo, useContext, RefObject, FC } from 'react';
import { AutotekaTeaserData } from '@marketplace/ui-kit';
import { getAutotekaTeaserData, TeaserData } from 'helpers/getAutotekaTeaserData';

export interface AutotekaBlockContextValue {
  teaserData: TeaserData[] | null;
  anchorEl: HTMLDivElement | null;
  handleClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleClose: (e: React.MouseEvent<HTMLElement>) => void;
  open: boolean;
  id: number | string;
}
interface AutotekaBlockProps {
  autotekaReportTeaser: AutotekaTeaserData;
  anchorRef: RefObject<HTMLDivElement>;
  id: number;
  brandAlias: string;
  modelAlias: string;
}

const initialValue: AutotekaBlockContextValue = {
  teaserData: null,
  anchorEl: null,
  handleClick: (_e) => {},
  handleClose: (_e) => {},
  open: false,
  id: '',
};

const AutotekaBlockContext = React.createContext<AutotekaBlockContextValue>(initialValue);

export const AutotekaBlockContextProvider: FC<AutotekaBlockProps> = memo(
  ({ children, id, brandAlias, modelAlias, anchorRef, autotekaReportTeaser }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const url = `/offer/${brandAlias}/${modelAlias}/${id}`;
    const teaserData = React.useMemo(() => {
      return getAutotekaTeaserData(autotekaReportTeaser);
    }, [autotekaReportTeaser]);
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      setAnchorEl(anchorRef.current);
    };
    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
      <AutotekaBlockContext.Provider value={{ open, teaserData, handleClose, handleClick, anchorEl, id }}>
        {children}
      </AutotekaBlockContext.Provider>
    );
  },
);

export const useAutotekaBlockContext = () => useContext(AutotekaBlockContext);
