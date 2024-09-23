import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { signIn, auth, providerMap } from '@/lib/auth'
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Login',
};

export default async function SignIn() {
    const session = await auth();

    if (session) {
        redirect('/');
    }

    return (
        <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white'>
            <div className='flex flex-col gap-2 items-center justify-center'>
                {Object.values(providerMap).map((provider) => (
                    <form key={provider.id} action={async () => {
                        'use server'
                        try {
                            await signIn(provider.id, {
                                redirectTo: '',
                        })
                        } catch (error) {
                            throw error
                        }
                    }}>
                        <Button type='submit'>
                            <span>Sign in with {provider.name}</span>
                        </Button>
                    </form>
                ))}
            </div>
        </div>
    )
}