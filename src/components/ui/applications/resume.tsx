'use client'

import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import style from '@/styles/resume.module.css'
import { ApplicationType } from '@/types/types';
import { useWindow } from '@/contexts/window/window.context';
import Image from 'next/image';

const Resume = ({
    wUuid
}: ApplicationType) => {
    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    }, []);

    const {
        getWindow
    } = useWindow()

    const onLoadSuccess = () => {
        console.log('loaded');
    }

    const styleOnMaximized = {
        display: 'flex',
        justifyContent: 'center'
    }

    const [hoverButtonMinus, setHoverButtonMinus] = useState<boolean>(false)
    const hoverButtonMinusStyle = {
        backgroundColor: hoverButtonMinus ? getWindow(wUuid)?.windowAttr.isMaximized ? 'rgba(104, 104, 104, 1)' : 'rgb(226, 226, 226)' : undefined 
    }
    
    const [hoverButtonPlus, setHoverButtonPlus] = useState<boolean>(false)
    const hoverButtonPlusStyle = {
        backgroundColor: hoverButtonPlus ? getWindow(wUuid)?.windowAttr.isMaximized ? 'rgba(104, 104, 104, 1)' : 'rgb(226, 226, 226)' : undefined 
    }

    const [pageScale, setPageScale] = useState<number>(1)

    return (
        <div
            className={style.container}
            style={
                getWindow(wUuid)!.windowAttr?.isMaximized ? styleOnMaximized : undefined
            }>
            <Document file='/util/resume.pdf'  onLoadSuccess={() => onLoadSuccess()} >
                <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} scale={pageScale}/>
            </Document>
                <div className={style.pdfControlContainer}>
                    <div className={style.controls}>
                        <button
                            className={style.pdfControlButtons}
                            onMouseEnter={() => setHoverButtonPlus(true)}
                            onMouseLeave={() => setHoverButtonPlus(false)}
                            style={{
                                ...hoverButtonPlusStyle
                            }}

                            onClick={() => {
                                if (pageScale < 2.5) {
                                    setPageScale(prev => prev + .1)
                                }
                            }}>
                            <Image
                                src={'/img/applications/resume/plus.svg'}
                                alt='Plus image'
                                width={20}
                                height={20}
                            />
                        </button>
                        <button
                            className={style.pdfControlButtons}
                            onMouseEnter={() => setHoverButtonMinus(true)}
                            onMouseLeave={() => setHoverButtonMinus(false)}
                            style={{
                                ...hoverButtonMinusStyle
                            }}
                            onClick={() => {
                                if (pageScale > 1) {
                                    setPageScale(prev => prev - .1)
                                }
                            }}>
                            <Image
                                src={'/img/applications/resume/minus.svg'}
                                alt='Minus image'
                                width={20}
                                height={20}
                            />
                        </button>
                    </div>
                    <span className={style.percentage}>{Math.floor(pageScale * 100 / 2)}%</span>
                </div>
        </div>
    )
}

export default Resume