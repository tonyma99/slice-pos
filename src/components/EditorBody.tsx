'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMenuSection } from '@/lib/actions'
import { Menu, MenuItem, MenuSection } from '@/lib/types'
import ConfirmationModal from '@/components/ConfirmationModal'
import EditorCard from '@/components/EditorCard'
import NewItemForm from '@/components/NewItemForm'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FaCircleExclamation, FaPlus, FaTrash } from 'react-icons/fa6'

type Props = {
    menu: Menu
}

export default function MenuEditor({ menu }: Props) {
    const [showAddItemForm, setShowAddItemForm] = useState<string | null>(null)
    const [editItemName, setEditItemName] = useState<MenuItem | null>(null)

    const router = useRouter()

    function editItem(menuItem: MenuItem, sectionName: string) {
        setEditItemName(menuItem)
        setShowAddItemForm(sectionName)
    }

    function handleDeleteMenuSection(sectionName: string) {
        deleteMenuSection({
            menuId: menu._id.toString(),
            sectionName
        })
        router.refresh()
    }
    
    function closeForm() {
        setShowAddItemForm(null)
        setEditItemName(null)
    }

    return (
        <div className='flex gap-8 flex-col'>
            {menu?.sections?.length > 0 ? (
                menu?.sections.map((section: MenuSection) => (
                    <div key={section.name} className='space-y-4'>
                        <div className='flex justify-between items-center'>
                            <h2 className='font-bold text-xl'>{section.name}</h2>
                            <div className='flex gap-2'>
                                <Button size='sm' variant='outline' className='text-[0px] sm:text-sm' onClick={() => {
                                    setShowAddItemForm(section.name)
                                }}>
                                    <FaPlus className='sm:mr-2 h-4 w-4' />
                                    Add Item
                                </Button>
                                <ConfirmationModal
                                    button={
                                        <Button size='sm' variant='outline' className='text-[0px] sm:text-sm'>
                                            <FaTrash className='sm:mr-2 h-4 w-4' />
                                            Delete Section
                                        </Button>
                                    }
                                    title='Delete Section'
                                    description='Are you sure you want to delete this section? This action cannot be undone.'
                                    action={() => handleDeleteMenuSection(section.name)}
                                />
                            </div>
                        </div>
                        <NewItemForm
                            show={showAddItemForm === section.name}
                            menuId={menu._id.toString()}
                            sectionName={section.name}
                            editItem={editItemName}
                            close={closeForm}
                        />
                        {section.items.length > 0 ? (
                            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                                {section.items.map((item: MenuItem) => (
                                    <EditorCard
                                        menuItem={item}
                                        sectionName={section.name}
                                        menuId={menu._id.toString()}
                                        showEditForm={editItem}
                                        closeForm={closeForm}
                                        key={item.name}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Alert>
                                <FaCircleExclamation className='h-4 w-4' />
                                <AlertTitle>You currently do not have any items!</AlertTitle>
                                <AlertDescription>
                                    You can add an item by clicking the 'Add Item' button above.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                ))
            ) : (
                <Alert>
                    <FaCircleExclamation className='h-4 w-4' />
                    <AlertTitle>You currently do not have any sections!</AlertTitle>
                    <AlertDescription>
                        You can add a section by clicking the 'Add Section' button above.
                    </AlertDescription>
                </Alert>

            )}
        </div>
    )
}
