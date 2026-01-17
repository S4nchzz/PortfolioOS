import { ItemType } from "@/lib/constants/Item.enum"

const apps: Record<ItemType, string> = {
    [ItemType.TERMINAL]: 'terminal.svg',
    [ItemType.RESUME]: 'resume.svg',
    [ItemType.BROSWER]: "browser.svg",
    [ItemType.CONTACT]: "contact.svg"
}

const getAppImage = (itemType: ItemType) => apps[itemType]

export default getAppImage