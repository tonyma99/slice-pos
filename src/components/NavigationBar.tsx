import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import { FaHouse, FaRightFromBracket, FaUser } from 'react-icons/fa6'

export default async function NavigationBar() {
    const session = await auth()

    return (
        <div className='h-16 flex items-center border-b border-neutral-200 px-4 justify-between font-bold text-xl'>
            <div className='flex gap-2'>
                <Link href='/'>
                    <span>🍴 Slice</span>
                </Link>
            </div>
            {session && (
                <div className='flex gap-2'>
                    <Link href='/dashboard' className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
                        <FaHouse size={20} />
                    </Link>
                    <Link href='/account' className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
                        <FaUser size={20} />
                    </Link>
                    <form action={async () => {
                        'use server'
                        await signOut()
                    }}>
                        <Button type='submit' variant='ghost' size='icon'>
                            <FaRightFromBracket size={20} />
                        </Button>
                    </form>
                </div>
            )}
        </div>
    )
}
