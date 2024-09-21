'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { createMenu } from '@/lib/actions'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components//ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FaPlus } from "react-icons/fa6";


const formSchema = z.object({
    name: z
        .string().
        min(3, {
            message: 'Name must be at least 3 characters',
        })
        .max(32, {
            message: 'Name must be at most 32 characters',
        }), 
    description: z
        .string()
        .min(0)
        .max(256 , {
            message: 'Description must be at most 256 characters',
        }),
})

export default function NewMenuForm () {
    const [createMenuDialogOpen, setCreateMenuDialogOpen] = useState(false)

    const { data: session } = useSession()

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        if (!session?.user?.id) return

        createMenu({
            userId: session?.user?.id,
            name: data.name,
            description: data.description
        })
        form.reset()
        setCreateMenuDialogOpen(false)
        router.refresh()
    }

    return (
        <AlertDialog open={createMenuDialogOpen} onOpenChange={setCreateMenuDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button className='inline-flex'>
                    <FaPlus className='mr-2 h-4 w-4' />
                    New Menu
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create a New Menu</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please enter the Name and Description of the new menu.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='gap-4 flex flex-col w-full'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea className='resize-none h-32' {...field} />
                                        </FormControl>
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )}
                            />
                            <div className='flex gap-4'>
                                <Button type='submit' className='w-full'>Create Menu</Button>
                                <Button variant='outline' type='reset' className='w-full' onClick={() => {
                                    setCreateMenuDialogOpen(false)
                                    form.reset()
                                }}>
                                    Cancel
                                </Button> 
                            </div>
                        </form>
                    </Form>
                </AlertDialogContent>
        </AlertDialog>
    )
}
