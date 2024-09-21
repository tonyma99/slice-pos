import { auth } from '@/lib/auth'
import { getMenus } from '@/lib/actions'
import Link from 'next/link'
import NewMenuForm from '@/components/NewMenuForm'
import { buttonVariants } from '@/components/ui/button'

export default async function Dashboard() {
    const session = await auth()

    if (!session?.user?.id) {
        return null
    }

    let menus = await getMenus({ userId: session.user.id})

    return (
        <div className='flex flex-col gap-4 max-w-5xl grow mx-auto'>
            {menus?.map((menu) => (
                <div key={menu._id.toString()} className='flex items-center justify-between'>
                    <p className='text-lg font-bold'>{menu.name} <span className='font-normal text-sm'> ({menu._id.toString()})</span></p>
                    <div>
                        <Link className={buttonVariants({ variant: 'outline' })} href={`/edit/${menu._id}`}>Edit</Link>
                    </div>
                </div>
            ))}
            <NewMenuForm />
        </div>
    )
}
