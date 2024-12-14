import Documents from "@/components/Documents"

export const dynamic = "force-dynamic"

function Dashboard() {
  return (
    <div className="bg-bg min-h-screen">
    <div className="h-full max-w-7xl mx-auto pt-5">
        <h1 className="text-3xl p-5 bg-black/20 font-extralight text-acc rounded-lg">My Documents</h1>

        <Documents />
    </div>
    </div>
  )
}
export default Dashboard