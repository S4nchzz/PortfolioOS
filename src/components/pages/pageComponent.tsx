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

    return (
        <div
            className={style.page}
            onKeyDown={(k) => {
                console.log(k);
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
        </div>
    )
}

export default PageComponent