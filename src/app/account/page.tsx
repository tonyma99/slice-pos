import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Image from "next/image"

export const metadata: Metadata = {
    title: 'Account',
}

export default async function Account() {
    const session = await auth()

    if (!session) {
        redirect("/signin")
    }

    const s = JSON.stringify(session?.user, null, 2)

    return (
        <div className="items-center flex flex-col h-full justify-center grow">
            <Image src={session?.user?.image ? session?.user?.image : 'https://g-jlyninynqx2.vusercontent.net/placeholder.svg'} alt="profile" width={100} height={100} className="rounded-full mb-4" />
            <p className="text-2xl font-bold">{session?.user?.name}</p>
            <p className="text-lg">{session?.user?.email}</p>
            <p className="text-lg">{session?.user?.id}</p>
        </div>
    )
}