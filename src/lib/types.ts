import { ObjectId } from "mongodb"

interface Menu {
    _id: ObjectId
    userId: ObjectId
    name: string
    description: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    sections: MenuSection[]
}

interface MenuSection {
    name: string
    order: number
    items: MenuItem[]
}

interface  MenuItem {
    name: string
    description: string
    price: number
    imageUrl: string | undefined
    order: number
    isAvailable: boolean
}

export type { Menu, MenuItem, MenuSection }
