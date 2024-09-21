import { redirect } from 'next/navigation'
import { auth } from "@/lib/auth"
import { checkMenuOwnership } from '@/lib/actions'
import MenuEditor from "@/components/MenuEditor"

type Props = {
    params: { slug: string }
}

export default async function Page ({ params }: Props) {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
        redirect('/signin')
    }

    const isOwner = await checkMenuOwnership({ userId: session.user.id, menuId: params.slug })

    if (!isOwner) {
        redirect('/')
    }

    return (
        <MenuEditor menuId={params.slug} />
    )
}