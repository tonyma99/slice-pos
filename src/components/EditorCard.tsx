'use client'
import { useRouter } from 'next/navigation'
import { deleteMenuItem } from '@/lib/actions'
import { MenuItem } from '@/lib/types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ConfirmationModal from '@/components/ConfirmationModal'
import { FaPen, FaTrash } from "react-icons/fa6";


type Props = {
    menuItem: MenuItem
    sectionName: string
    menuId: string
    showEditForm: (menuItem: MenuItem, sectionName: string) => void
    closeForm: () => void
}

export default function EditorCard({ menuItem, sectionName, menuId, showEditForm, closeForm }: Props) {
    const router = useRouter()

    const handleDeleteMenuItem = () => {
        deleteMenuItem({
            menuId,
            sectionName,
            itemName: menuItem.name
        })
        closeForm()
        router.refresh()
    }

    return (
        <Card className='overflow-hidden flex flex-col'>
            <Image
                src={menuItem.imageUrl ? menuItem.imageUrl : 'https://g-jlyninynqx2.vusercontent.net/placeholder.svg'}
                alt={menuItem.name}
                width={400}
                height={200}
                className='w-full h-48 object-cover'
            />
            <CardContent className='p-4 flex-grow flex flex-col'>
                <h4 className='font-semibold text-lg mb-2'>{menuItem.name}</h4>
                <p className='text-sm text-neutral-600 mb-2 flex-grow'>{menuItem.description}</p>
                <p className='text-sm font-semibold mb-4'>${menuItem.price.toFixed(2)}</p>
                <div className='flex justify-end space-x-2 mt-auto'>
                <Button variant='outline' size='sm' onClick={() => {
                    showEditForm(menuItem, sectionName)
                }}>
                    <FaPen className='h-4 w-4' />
                </Button>
                <ConfirmationModal
                    button={
                        <Button variant='outline' size='sm'>
                            <FaTrash className='h-4 w-4' />
                        </Button>
                    }
                    title='Delete Item'
                    description='Are you sure you want to delete this item? This action cannot be undone.'
                    action={handleDeleteMenuItem}
                />
                </div>
            </CardContent>
        </Card>
    )
}