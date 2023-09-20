import { ReactNode } from 'react';

export type InputDataFieldsType = {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  value: string | number | boolean;
  Icon?: ReactNode;
  customOptions?: { [key: string]: string | number };
  hasRef?: boolean;
};
