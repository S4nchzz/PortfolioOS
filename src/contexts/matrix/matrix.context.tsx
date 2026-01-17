'use client'

import { MatrixEnum } from "@/lib/constants/matrix.enum";
import { Item } from "@/lib/matrix/Item";
import { ItemComponentTypeCurrentIndex, ItemFromJSON } from "@/types/types";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

type MatrixContextType = {
    matrix: (Item | null)[][] | undefined,
    setMatrix: Dispatch<SetStateAction<(Item | null)[][] | undefined>>
}

export const MatrixContext = createContext<MatrixContextType | undefined>(undefined)

const MatrixProvider = ({ children }: {children: ReactNode}) => {
    const [matrix, setMatrix] = useState<(Item | null)[][] | undefined>(undefined)
    
    const generateEmptyMatrix = () => {
        const eMatrix: (Item | null)[][] = Array.from({ length: MatrixEnum.ROWS }, () =>
            Array.from({ length: MatrixEnum.COLS }, () => null)
        )

        return eMatrix
    }

    const preloadLocalStorageMatrix = (): boolean => {
        if (typeof window === 'undefined') return false
        const mtx_pos_save = localStorage.getItem('mtx_pos_save')
        if (!mtx_pos_save) return false
        const preloadMatrixJSON = JSON.parse(mtx_pos_save)

        const preloadMatrix: (Item | null)[][] = preloadMatrixJSON.map((row: []) => {
            return row.map((cell: Item | null) => {
                if (!cell) return null
                return new Item(cell.img, cell.name, cell.type)
            })
        })

        console.log(preloadMatrix);
        setMatrix(preloadMatrix)
        return true
    }

    useEffect(() => {
        if (preloadLocalStorageMatrix()) return

        const matrix = generateEmptyMatrix()

        const getMainItems = async() => {
            const data = await fetch('/util/mainApps.json')
            if (!data) throw new Error('mainApp.json empty or not found.')
            const json: ItemFromJSON[] = await data.json()
        
            if (!matrix) throw new Error('Matrix is not initialized.')
            
            let nextRow = 0
            let nextCol = 0
            json.forEach((defaultItem) => {
                matrix[nextRow][nextCol] = new Item(
                    defaultItem.img,
                    defaultItem.name,
                    defaultItem.type
                )

                if (nextRow == MatrixEnum.ROWS - 1) {
                    nextRow = 0;
                    nextCol++
                } else {
                    nextRow++
                }
                
                if (nextCol == MatrixEnum.COLS - 1) {
                    nextCol = 0
                    nextRow++
                }
            })

            setMatrix(matrix)
        }

        getMainItems()
    }, [])

    useEffect(() => {
       
    }, [matrix])

    return (
        <MatrixContext.Provider value={{ matrix, setMatrix }}>
            {children}
        </MatrixContext.Provider>
    )
}

export default MatrixProvider

export const useMatrix = () => {
    const matrixContext = useContext(MatrixContext)
    const [matrix, setMatrix] = useState<(null | Item)[][]>()

    useEffect(() => {
        if (!matrixContext?.matrix) return

        if (typeof window !== 'undefined') {
            localStorage.setItem('mtx_pos_save', JSON.stringify(matrixContext?.matrix))
        }
        setMatrix(matrixContext?.matrix)
    }, [matrixContext?.matrix])

    const checkMatrix = () => {
        if (!matrixContext) throw new Error('Matrix context is undefined, where are you using this hook?')
        if (!matrix) throw new Error('Matrix is undefined.')
    }

    const getMatrix = () => matrix

    const addElement = (item: Item, newUuid: boolean) => {
        checkMatrix()
        if (newUuid) {
            item = new Item(item.img, item.name, item.type)
        }

        const matrixUpdated = [...matrix!]

        let updated = false
        for (let i = 0; i < MatrixEnum.ROWS; i++) {
            for (let k = 0; k < MatrixEnum.COLS; k++) {
                if (!matrixUpdated[i][k]) {
                    matrixUpdated[i][k] = item
                    updated = true
                }

                if (updated) break
            }   
            if (updated) break
        }

        matrixContext!.setMatrix(matrixUpdated)
    }

    const addElementByRowCol = ({ row, col, item, lastElementPosition }: { row: number, col: number, item: Item, lastElementPosition: ItemComponentTypeCurrentIndex }) => {
        checkMatrix()

        if (!matrix![row][col]) {
            const matrixUpdated = [...matrix!]

            matrixUpdated[row][col]  = item
            matrixUpdated[lastElementPosition.row][lastElementPosition.col] = null

            setMatrix(matrixUpdated)
            matrixContext!.setMatrix(matrixUpdated)
        }
    }

    const getElement = () => {}

    const getElementByUuid = (uuid: string): Item | undefined => {
        checkMatrix()

        const item = matrixContext!.matrix?.flatMap((r) => r)
        .filter((ci) => ci !== null)
        .find((ci) => ci?.uuid == uuid)

        return item ? item : undefined
    }

    const getElementByRowCol = ({ row, col }: { row: number, col: number}) => {}

    const removeElement = () => {}

    const removeElementByUuid = (uuid: string) => {
        checkMatrix()

        matrixContext!.setMatrix((prev) => {
            return prev?.map((row) => {
                const rowUpdated = row.map((ci) => {
                    if (ci?.uuid === uuid) {
                        return null
                    }

                    return ci
                })
                return rowUpdated
            })
        })
    }

    const removeElementByRowCol = ({ row, col }: { row: number, col: number}) => {}

    return {
        getMatrix,
        addElement,
        getElementByUuid,
        addElementByRowCol,
        getElement,
        getElementByRowCol,
        removeElement,
        removeElementByRowCol,
        removeElementByUuid
    }
}