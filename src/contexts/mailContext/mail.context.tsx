'use client'

import { MailContextAttr } from "@/types/types"
import { createContext, ReactNode, useContext, useState } from "react"

export const MailContext = createContext<MailContextAttr | undefined>(undefined)

const MailProvider = ({ children }: {
    children: ReactNode
}) => {
    const defaultTime = 900000
    const [mailBlocked, setMailBlocked] = useState<boolean>(false)
    const [timeoutTime, setTimeoutTime] = useState<number>(defaultTime)
    
    return (
        <MailContext.Provider value={{
            defaultTime,
            timeoutTime,
            setTimeoutTime,
            mailBlocked,
            setMailBlocked
        }}>
            {children}
        </MailContext.Provider>
    )
}

export default MailProvider

export const useMail = () => {
    const ctx = useContext(MailContext)

    const checkCtx = () => {
        if (!ctx) throw new Error('MailContext is not initialzied, where are you using this hook?')
    }

    let interval: NodeJS.Timeout | null = null

    const applyTimeout = (savedTimeout?: number) => {
        checkCtx()

        if (interval) clearInterval(interval)

        if (savedTimeout) ctx!.setTimeoutTime(savedTimeout)

        ctx!.setMailBlocked(true)
        interval = setInterval(() => {
            ctx!.setTimeoutTime(prev => {
                if (prev == 0) {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('mtout')
                    }
                    clearInterval(interval!)
                    
                    ctx!.setMailBlocked(false)
                    return ctx!.defaultTime
                }
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem('mtout', (prev - 1000).toString())
                }
                return prev - 1000
            })
        }, 1000)
    }

    const currentTime = () => {
        checkCtx()

        return ctx!.timeoutTime
    }

    const defaultTime = () => {
        checkCtx()

        return ctx!.defaultTime
    }

    const isMailBocked = () => {
        checkCtx()

        return ctx!.mailBlocked
    }

    return {
        applyTimeout,
        defaultTime,
        currentTime,
        isMailBocked
    }
}