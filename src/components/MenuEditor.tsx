import { redirect } from 'next/navigation'
import { getMenu } from '@/lib/actions'
import EditorBody from '@/components/EditorBody'
import EditorMenu from '@/components/EditorMenu'

type Props = {
    menuId: string
}

export default async function MenuEditor({ menuId }: Props) {
    const menu = await getMenu({ menuId })

    if (!menu) {
        redirect('/')
    }
    
    return (
        <div className='flex flex-col gap-4 max-w-7xl mx-auto'>
            <div className='flex flex-col gap-2'>
                <h1 className='font-bold text-2xl'>{menu.name}</h1>
                {menu.description !== '' && (
                    <p>{menu.description}</p>
                )}
            </div>
            <EditorMenu menuId={menu._id.toString()} />
            <EditorBody menu={JSON.parse(JSON.stringify(menu))} />
        </div>
    )
}
