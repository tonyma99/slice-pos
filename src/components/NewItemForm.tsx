'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addMenuItem, updateMenuItem } from '@/lib/actions'
import { MenuItem } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
    name: z.string().min(2).max(24),
    description: z.string().min(0).max(256),
    price: z.coerce.number().min(0),
    imageUrl: z.string().url().optional().or(z.literal('')),
})

type Props = {
    menuId: string
    sectionName: string
    editItem?: MenuItem | null
    show: boolean
    close: () => void
}

export default function NewItemForm({ menuId, sectionName, editItem, show, close }: Props) {
    const router = useRouter()

    useEffect(() => {
        if (editItem) {
            form.setValue('name', editItem.name)
            form.setValue('description', editItem.description)
            form.setValue('price', editItem.price)
            form.setValue('imageUrl', editItem.imageUrl)
        }
    }, [editItem])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            imageUrl: '',
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {        
        if (editItem) {
            const update = {
                name: values.name,
                description: values.description,
                price: values.price,
                imageUrl: values.imageUrl
            }
            updateMenuItem({
                menuId,
                sectionName: sectionName,
                itemName: editItem.name,
                update
            })
        } else {
            addMenuItem({
                menuId,
                sectionName: sectionName,
                itemName: values.name,
                description: values.description,
                price: values.price,
                imageUrl: values.imageUrl
            })
        }
        form.reset()
        router.refresh()
        close()
    }

    return (
        <>
            {show && (
                <Card className='mt-4 p-4'>
                    <CardContent className='p-0'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 '>
                                <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Item Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder='' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-sm' />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Item Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder='' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-sm' />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name='price'
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Item Price</FormLabel>
                                    <FormControl>
                                        <Input placeholder='' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-sm' />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name='imageUrl'
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder='' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-sm' />
                                    </FormItem>
                                )}
                                />
                                <div className='flex gap-2'>
                                    <Button type='submit'>{editItem === null ? 'Add Item' : 'Update Item'}</Button>
                                    <Button variant='outline' type='reset' onClick={() => {
                                        form.reset()
                                        close()
                                    }}>Cancel</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </>
    )
}