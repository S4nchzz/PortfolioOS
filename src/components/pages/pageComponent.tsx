'use client'

import style from '@/styles/pageComponent.module.css'

import DesktopRender from '../ui/desktop_render/desktopRender'
import { useItems } from '@/contexts/items/items.context'
import CtxMenu from '../ui/ctxMenu/ctxMenu'
import useMouse from '@/hooks/useMouse'
import { useCtxMenu } from '@/contexts/ctxMenu/ctxMenuContext'
import { useEffect, useState } from 'react'
import { useWindow } from '@/contexts/window/window.context'
import { useTaskbar } from '@/contexts/taskbar/taskbar.context'
import { useMatrix } from '@/contexts/matrix/matrix.context'
import Image from 'next/image'
import { motion } from 'framer-motion'

const PageComponent = () => {
    const {
        resetGlobalStyle
    } = useItems()

    const {
        pos
    } = useMouse()

    const {
        getItemUuid,
        setItemUuid,
        getXy,
        setXY,
        hide,
        isHidden
    } = useCtxMenu()

    const {
        unFocusAll
    } = useWindow()

    const {
        unfocusTaskbarMenus
    } = useTaskbar()

    useEffect(() => { hide(true) }, [])

    const {
        addElement
    } = useMatrix()

    const {
        getCopiedItem
    } = useCtxMenu()

    const [ctrlPressed, setCtrlPressed] = useState<boolean>(false)

    const [keysPressed, setKeysPressed] = useState<string>('')
    const [animateEasterEgg, setAnimateEasterEgg] = useState<boolean>(false)

    useEffect(() => {
        console.log(keysPressed);
        if (keysPressed === '33') {
            setAnimateEasterEgg(true)
            return
        }
        setAnimateEasterEgg(false)
    }, [keysPressed])

    return (
        <div
            className={style.page}
            onKeyDown={(k) => {
                if (Number.isNaN(Number(k.key))) return

                if (keysPressed?.length === 2) {
                    if (k.key === '3' && keysPressed === '33') {
                        setKeysPressed('3')
                        return
                    }
                    setKeysPressed(prev => prev.at(prev.length - 1) + k.key)
                    return
                }

                setKeysPressed(prev => prev + k.key)
            }}>
            <div className={style.virtualBody}/>
            <div
                className={style.container}
                tabIndex={0}
                onClick={() => {
                    resetGlobalStyle()
                    hide(true)
                    unFocusAll()
                    unfocusTaskbarMenus()  
                }}
                onContextMenu={(e) => {
                    e.preventDefault()
                    setXY({ x: pos.x, y: pos.y })
                    setItemUuid(undefined)
                    hide(false)
                }}

                onKeyDown={(k) => {
                    if (k.code == 'ControlLeft') setCtrlPressed(true)
                    if (k.code == 'KeyV' && ctrlPressed) {
                        const copiedItem = getCopiedItem()
                        if (!copiedItem) return
                        
                        addElement(copiedItem, true)
                    }
                }}
                
                onKeyUp={(k) => {
                    if (k.code == 'ControlLeft') setCtrlPressed(false)
                }}
                >

                <CtxMenu xy={getXy()} itemUuid={getItemUuid()} hide={isHidden()}/>
                <DesktopRender/>
            </div>
            {
                animateEasterEgg && (
                    <motion.div
                        initial={{ y: 500, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ 
                            duration: 1.2, 
                            ease: "easeOut",
                            delay: 0.3
                        }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            zIndex: 999998,
                            filter: 'drop-shadow(0 0 0.45rem red)'
                        }}
                    >
                        <Image
                            src={'/img/fernando.png'}
                            alt='Easteregg'
                            width={320}
                            height={320}
                        />
                    </motion.div>
                )
            }
        </div>
    )
}

export default PageComponent