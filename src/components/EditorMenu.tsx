'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMenu } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import ConfirmationModal from '@/components/ConfirmationModal'
import NewSectionForm from '@/components/NewSectionForm'
import { FaPlus, FaUpRightFromSquare } from 'react-icons/fa6'

type Props = {
    menuId: string
}

export default function EditorMenu({ menuId }: Props) {
    const [showAddSectionForm, setShowAddSectionForm] = useState(false)

    const router = useRouter()

    function handleDeleteMenu() {
        deleteMenu({ menuId })
        router.push('/')
    }

    return (
        <div>
            <div className='flex justify-between'>
                <div className='flex flex-col gap-3 sm:flex-row justify-between grow items-center'>
                    <div className='gap-3 flex w-full'>
                        <Button variant='outline' className='w-full sm:w-fit' onClick={() => setShowAddSectionForm(true)}>
                            <FaPlus className='mr-2 h-4 w-4' />
                            Add Section
                        </Button>
                        <Button className='w-full sm:w-fit'>
                            <FaUpRightFromSquare className='mr-2 h-4 w-4' />
                            View Menu
                        </Button>
                    </div>
                    <div className='flex gap-3 items-center w-full justify-end'>
                        <ConfirmationModal
                            button={
                                <Button variant='outline' className='w-full sm:w-fit'>
                                    Delete Menu
                                </Button>
                            }
                            title='Delete Menu'
                            description='Are you sure you want to delete this menu? This action cannot be undone.'
                            action={handleDeleteMenu}
                        />
                    </div>
                </div>
            </div>
            <NewSectionForm
                menuId={menuId}
                show={showAddSectionForm}
                close={() => setShowAddSectionForm(false)}
            />
        </div>
    )
}
