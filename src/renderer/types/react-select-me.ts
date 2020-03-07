declare module 'react-select-me' {
  interface SelectProps<T, TValue extends T | T[]> {
    addNewItem?: boolean | string | JSX.Element | ((searchValue: string) => JSX.Element);
    beforeClose?: (event: any) => boolean;
    beforeOpen?: (event: any) => boolean;
    /**
     * default 8
     */
    boundaryMargin?: number;
    disabled?: boolean;
    error?: boolean;
    getWrapper?: () => JSX.Element;
    iconRenderer?: (isOpen: boolean) => JSX.Element;
    immutable?: boolean;
    isOpened?: boolean;
    /**
     * default 'label'
     */
    labelKey?: string;
    listHeight?: number;
    listRenderer?: (
      options: T[],
      selectedOptions: T[],
      optionRenderer: (option: T, selectedOptions: T[]) => JSX.Element,
      onChange: (value: TValue) => void,
      onToggleList: () => void,
    ) => JSX.Element;
    multiple?: boolean;
    listMaxHeight?: number;
    /**
     * default 'auto'
     */
    listPosition?: 'top' | 'bottom' | 'auto';
    noItemsFound?: boolean | string | (() => JSX.Element) | JSX.Element;
    onChange: (value: TValue) => void;
    onClose?: () => void;
    onOpen?: () => void;
    /**
     * default 40
     */
    optionHeight?: number;
    options?: T[];
    value?: TValue;
    /**
     * default 'value'
     */
    valueKey?: string;
    optionRenderer?: (option: T, selectedOptions: T[]) => JSX.Element;
    onSearch?: (searchValue: string) => void;
    /**
     * default 'Select ...'
     */
    placeholder?: string;
    s?: {
      // wrapper
      dd__wrapper: string;
      // applied to multi select
      dd__multi: string;
      // applied to single select
      dd__single: string;
      // applied when dropdown opened
      dd__opened: string;
      // applied when dropdown has error property
      dd__error: string;
      // disabled
      dd_disabled: string;
      // selected block class
      dd__selectControl: string;
      // selected values wrapper class
      dd__selected: string;
      // placeholder class
      dd__placeholder: string;
      // selected option class
      dd__selectedItem: string;
      // icon to remove selected value class
      dd__crossIcon: string;
      // list class
      dd__list: string;
      // virtualized list class
      dd__listVirtualized: string;
      // applied when select opens to bottom
      dd__openTobottom: string;
      // applied when select opens to top
      dd__openTotop: string;
      // dropdown option
      dd__option: string;
      // dropdown option
      dd__optionDisabled: string;
      // virtualized option class
      dd__optionVirtualized: string;
      // selected dropdown option
      dd__selectedOption: string;
    };
    searchable?: boolean;
    searchClearOnClose?: boolean;
    searchDefaultsToSelectedValue?: boolean;
    searchInputRenderer?: () => JSX.Element;
    selectedBlockRenderer?: (
      selectedOptions: T[],
      onRemove: () => void,
      selectedValueRenderer: (option: T, onRemove: () => void) => void,
      searchInputRenderer: () => void,
    ) => void;
    selectedValueRenderer?: (option: T, onRemove: () => void) => void;
    virtualized?: boolean;
  }
  const Select: <T, TValue extends T | T[] = T>(props: SelectProps<T, TValue>) => JSX.Element;
  export default Select;
}
