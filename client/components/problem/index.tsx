import Navbar from '../LandingPage/Navbar'
import Description from './Description'
import EditorSection from './EditorSection'
import { getProblemById } from '@/actions/getProblemById'

const index = async({id}:{id:string}) => {
  const problem = await getProblemById(id)
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar/>
      <div className="max-w-screen-xl mx-auto px-4 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <Description problem={problem} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <EditorSection problem={problem} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default index