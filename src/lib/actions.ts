'use server'
import client from '@/lib/mongodb'
import { Menu, MenuItem, MenuSection } from '@/lib/types'
import { UserModel } from '@/lib/auth.config'
import { Collection, ObjectId } from 'mongodb'

const dbName = process.env.NODE_ENV === "development" ? 'test' : 'production'

const db = client.db(dbName)
const menusCollection: Collection<Menu> = db.collection<Menu>('menus')

export async function createMenu(input: {userId: string, name: string, description: string}) {  
    try {
        const now = new Date()

        const newMenu: Omit<Menu, '_id'> = {
            userId: new ObjectId(input.userId),
            name: input.name,
            description: input.description,
            isActive: true,
            createdAt: now,
            updatedAt: now,
            sections: [],
        }

        await menusCollection.insertOne(newMenu as Menu)
    } catch (error) {
        console.error(error)
    }
}

export async function checkMenuOwnership(input: {userId: string, menuId: string}) {
    try {
        return await menusCollection.countDocuments({
            _id: new ObjectId(input.menuId),
            userId: new ObjectId(input.userId),
        }) > 0
        
    } catch (error) {
        console.error(error)
    }
}

export async function getMenu(input: {menuId: string}) {
    try {
        return await menusCollection.findOne({
            _id: new ObjectId(input.menuId),
        })
    } catch (error) {
        console.error(error)
    }
}

export async function getMenus(input: {userId: string}) {
    try {
        return await menusCollection.find({
            userId: new ObjectId(input.userId)
        }).toArray()
    } catch (error) {
        console.error(error)
    }
}

export async function deleteMenu(input: { menuId: string }) {
    try {
        await menusCollection.deleteOne({
            _id: new ObjectId(input.menuId),
        })
    } catch (error) {
        console.error(error)
    }
}

export async function addMenuSection(input: { menuId: string, sectionName: string }) {
    try {
        const menu = await menusCollection.findOne({
            _id: new ObjectId(input.menuId),
        })

        if (!menu) {
            throw new Error('Menu not found')
        }

        const newOrder = menu.sections.length + 1

        const newSection: MenuSection = {
            name: input.sectionName,
            order: newOrder,
            items: []
        }

        const result = await menusCollection.updateOne(
            { _id: new ObjectId(input.menuId) },
            { 
                $push: { sections: newSection },
                $set: { updatedAt: new Date() }
            }
        )

        return result.modifiedCount > 0
    } catch (error) {
        console.error(error)
    }
}

export async function deleteMenuSection(input: { menuId: string, sectionName: string }) {
    await menusCollection.updateOne(
        { _id: new ObjectId(input.menuId) },
        { 
            $pull: { sections: { name: input.sectionName } }, 
            $set: { updatedAt: new Date() }
        }
    )
}

export async function addMenuItem(input: {
    menuId: string,
    sectionName: string,
    itemName: string,
    description: string,
    price: number,
    imageUrl?: string
}) {
    try {
        const menu = await menusCollection.findOne({
            _id: new ObjectId(input.menuId),
        })

        if (!menu) {
            throw new Error('Menu not found or does not belong to the user')
        }

        const newOrder = menu.sections.find(section => section.name === input.sectionName) ?
            menu.sections.find(section => section.name === input.sectionName)!.items.length + 1 : 0
        
        const newItem: MenuItem = {
            name: input.itemName,
            description: input.description,
            price: input.price,
            imageUrl: input.imageUrl,
            order: newOrder,
            isAvailable: true
        }

        const result = await menusCollection.updateOne(
            { _id: new ObjectId(input.menuId), 'sections.name': input.sectionName },
            {
                $push: { 'sections.$.items': newItem },
                $set: { updatedAt: new Date() }
            }
        )

        return result.modifiedCount > 0
    } catch (error) {
        console.error(error)
    }
}

export async function deleteMenuItem(input: { menuId: string, sectionName: string, itemName: string }) {
    try {
        const result = await menusCollection.updateOne(
            { _id: new ObjectId(input.menuId), 'sections.name': input.sectionName },
            {
                $pull: { 'sections.$.items': { name: input.itemName } },
                $set: { updatedAt: new Date() }
            },
        )

        return result.modifiedCount > 0
    } catch (error) {
        console.error(error)
    }
}

export async function updateMenuItem(input: {
    menuId: string,
    sectionName: string,
    itemName: string,
    update: Partial<MenuItem>
}) {
    try {
        const result = await menusCollection.updateOne(
            { _id: new ObjectId(input.menuId), 'sections.name': input.sectionName },
            { $set: { 'sections.$.items.$[item]': input.update, updatedAt: new Date() }, },
            { arrayFilters: [{ 'item.name': input.itemName }] }
        )

        return result.modifiedCount > 0
    } catch (error) {
        console.error(error)
    }
}
