import { WindowAttr } from "@/interface/windowIface";
import { ItemType } from "@/lib/constants/Item.enum";

const defaultWindowAttr: WindowAttr = {
    width: '1400px',
    minWidth: undefined,
    height: '700px',
    minHeight: undefined,
    isOpened: true,
    isFocused: true,
    isMinimized: false,
    isMaximized: false,
    x: 0,
    y: 0,
    zindex: 0
};

export const appWindowDefaultAttr: Record<ItemType, WindowAttr> = {
    'TERMINAL': {
        ...defaultWindowAttr,
        width: '1100px',
        height: '600px',
    },
    'RESUME': {
        ...defaultWindowAttr,
        minWidth: '500px',
        width: 'fit-content',
        height: '90vh',
    },
    'BROWSER': {
        ...defaultWindowAttr
    },
    'CONTACT': {
        ...defaultWindowAttr,
        width: '750px',
        height: '550px'
    },
};

const getDefaultWindowAttr = (type: ItemType) => appWindowDefaultAttr[type]

export default getDefaultWindowAttr