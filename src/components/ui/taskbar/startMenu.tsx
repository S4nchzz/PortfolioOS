import { useOSState } from '@/contexts/osStatus/osStatus.context'
import { useTaskbar } from '@/contexts/taskbar/taskbar.context'
import style from '@/styles/startmenu.module.css'
import { ItemFromJSON, TaskBarMenuStateType } from '@/types/types'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'
import StartMenuItem from './startMenuItem'
import { useWindow } from '@/contexts/window/window.context'
import { v4 as uuidv4 } from 'uuid';
import getAppComponent from '@/helper/getAppComponent'
import getDefaultWindowAttr from '@/helper/getDefaultWindowAttr'
import { ItemType } from '@/lib/constants/Item.enum'

const StartMenu = ({ open }: TaskBarMenuStateType) => {
    const [featApps, setFeatApps] = useState<ItemFromJSON[]>()
    
    useEffect(() => {
        const fetchApps = async() => {
            const data = await fetch('/util/mainApps.json')
            if (!data) throw new Error('mainApp.json empty or not found.')
                setFeatApps(await data.json())
        }
        
        fetchApps()
    }, [])
    
    const [appFilterName, setAppFilterName] = useState<string>('')
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setAppFilterName(e.target.value)
    
    const [showOffMenu, setShowOffMenu] = useState<boolean>(false)
    useEffect(() => {
        if (!open) setShowOffMenu(false)
    }, [open])

    const {
        alterOSState
    } = useOSState()

    const {
        stamVisibility
    } = useTaskbar()
    
    const {
        addWindow
    } = useWindow()

    return (
        <motion.div
            onClick={(e) => e.stopPropagation()}
            className={style.container}
            initial={{
                opacity: 0,
                y: 10
            }}
            animate={{
                opacity: open ? 1 : undefined,
                y: open ? 0 : undefined,
                pointerEvents: !open ? 'none' : undefined
            }}

            transition={{
                duration: .25
            }}>
                <div className={style.inputContainer}>
                    <Image
                        className={style.inputImg}
                        src={'/img/desktop/taskbar/mag_glass.svg'}
                        width={24}
                        height={24}
                        alt='Search'
                    />
                    <input
                        placeholder='Search programs, configurations or documents'
                        onChange={handleSearchChange}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>

                <div className={style.smBody}>
                    {
                        featApps?.map((app, idx) => {
                            if (!appFilterName || app.name.toLowerCase().includes(appFilterName.toLowerCase())) {
                                return <StartMenuItem key={idx} type={app.type} name={app.name} img={app.img}/>
                            }

                        })
                    }
                </div>

                <motion.div
                    animate={{
                        opacity: showOffMenu ? 1 : 0,
                    }}

                    style={{
                        pointerEvents: showOffMenu ? 'all' : 'none'
                    }}
                    className={style.offMenu}>
                    <ul>
                        <li onClick={() => {
                            setShowOffMenu(false)
                            stamVisibility(false)
                            alterOSState(false)
                        }}>
                            <Image
                                className={style.offMenuIcons}
                                src={'/img/desktop/taskbar/power_off.svg'}
                                width={28}
                                height={28}
                                alt='User'
                            />
                            Power off
                        </li>
                        <li onClick={() => {
                            setShowOffMenu(false)
                            stamVisibility(false)
                            alterOSState(false)
                        }}>
                            <Image
                                className={style.offMenuIcons}
                                src={'/img/desktop/taskbar/suspend.svg'}
                                width={28}
                                height={28}
                                alt='User'
                            />
                            Suspend
                        </li>
                    </ul>
                </motion.div>

                <div className={style.stamControls}>
                    <div className={style.user}>
                        <Image
                            className={style.userImg}
                            src={'/img/desktop/taskbar/user_logo.png'}
                            width={64}
                            height={64}
                            alt='User'
                        />
                        <span>S4nchzz</span>
                    </div>
                    <Image
                        className={style.powerOffImg}
                        src={'/img/desktop/taskbar/power_off.svg'}
                        width={28}
                        height={28}
                        alt='User'
                        onClick={(e) => setShowOffMenu(!showOffMenu)}
                    />
                </div>
        </motion.div>
    )
}

export default StartMenu