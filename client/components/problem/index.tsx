import Navbar from '../LandingPage/Navbar'
import Description from './Description'
import EditorSection from './EditorSection'
import { getProblemById } from '@/actions/getProblemById'

const index = async({id}:{id:string}) => {
  const problem =await getProblemById(id)
  return (
 <div>
    <Navbar/>
  <div className=' flex justify-between'>
        <div className=' w-1/2'>
          <Description problem={problem} />
        </div>
        <div className='w-1/2'>
          <EditorSection problem={problem} />
        </div>
      </div>
 </div>
  )
}

export default index