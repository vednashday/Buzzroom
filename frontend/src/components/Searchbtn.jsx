import { Search } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

const Searchbtn = () => {
  return (
    <div >
        <Link
          to="/search"
          className="btn btn-square rounded-lg "
          >
          <Search className='size-4'/>
        </Link>
    </div>
    
  )
}

export default Searchbtn