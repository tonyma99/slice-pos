import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Account() {
    const session = await auth()

    if (!session) {
        redirect("/signin")
    }

    const s = JSON.stringify(session?.user, null, 2)

    return (
        <div className="items-center flex h-full justify-center">
            <pre>
                {s}
            </pre>
        </div>
    )
}