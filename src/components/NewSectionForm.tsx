import { useRouter } from 'next/navigation'
import { addMenuSection } from '@/lib/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
    title: z.string().min(2).max(24),
})

type Props = {
    menuId: string
    show: boolean
    close: () => void
}

export default function NewSectionForm({ menuId, show, close }: Props) {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: '',
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        addMenuSection({
            menuId, 
            sectionName: values.title
        })
        form.reset()
        close()
        router.refresh()
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
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>New Section Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder='' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-sm' />
                                    </FormItem>
                                )}
                                />
                                <div className='flex gap-2'>
                                    <Button type='submit'>Add Section</Button>
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