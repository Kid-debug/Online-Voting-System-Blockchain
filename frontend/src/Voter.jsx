import React from 'react'
import { Link } from 'react-router-dom'

function Voter() {
  return (
    <div className='px-5 py-3'>
        <div className='d-flex justify-content-center mt-2'>
            <h3>Voter List</h3>
        </div>
        <Link to="/createVoter" className='btn btn-success'>Add Voter</Link>
        <div className='mt-3'></div>
        <table className='table'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Student ID</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Ng Hooi Seng</td>
                    <td>
                        <img src="public/img1.jpg" alt="" className='voter_image'/>
                    </td>
                    <td>2205578</td>
                    <td>nghs-wm20@student.tarc.edu.my</td>
                    <td>0110789007</td>
                    <td>
                    <Link to="/editVoter" className='btn btn-primary btn-sm'><i className="fs-4 bi-pencil"></i></Link>
                    <button className='btn btn-danger btn-sm'><i className="fs-4 bi-trash"></i></button>
                    </td>
                </tr>
                <tr>
                    <td>Woon Zhong Liang</td>
                    <td>
                        <img src="public/img2.jpg" alt="" className='voter_image'/>
                    </td>
                    <td>2205619</td>
                    <td>woonzl-wm20@student.tarc.edu.my</td>
                    <td>0112345678</td>
                    <td>
                    <button className='btn btn-primary btn-sm'><i className="fs-4 bi-pencil"></i></button>
                    <button className='btn btn-danger btn-sm'><i className="fs-4 bi-trash"></i></button>
                    </td>
                </tr>
                <tr>
                    <td>Kurt Cheong Jun Wei</td>
                    <td>
                        <img src="public/img3.jpg" alt="" className='voter_image'/>
                    </td>
                    <td>2205501</td>
                    <td>kurtcjw-wm20@student.tarc.edu.my</td>
                    <td>0111678907</td>
                    <td>
                    <button className='btn btn-primary btn-sm'><i className="fs-4 bi-pencil"></i></button>
                    <button className='btn btn-danger btn-sm'><i className="fs-4 bi-trash"></i></button>
                    </td>
                </tr>
                <tr>
                    <td>Choo Ming Yaw</td>
                    <td>
                        <img src="public/img4.jpg" alt="" className='voter_image'/>
                    </td>
                    <td>2205502</td>
                    <td>choomw-wm20@student.tarc.edu.my</td>
                    <td>0111678908</td>
                    <td>
                    <button className='btn btn-primary btn-sm'><i className="fs-4 bi-pencil"></i></button>
                    <button className='btn btn-danger btn-sm'><i className="fs-4 bi-trash"></i></button>
                    </td>
                </tr>
                <tr>
                    <td>Chye Wenn Han</td>
                    <td>
                        <img src="public/img5.jpg" alt="" className='voter_image'/>
                    </td>
                    <td>2205503</td>
                    <td>chyewh-wm20@student.tarc.edu.my</td>
                    <td>0111678909</td>
                    <td>
                    <button className='btn btn-primary btn-sm'><i className="fs-4 bi-pencil"></i></button>
                    <button className='btn btn-danger btn-sm'><i className="fs-4 bi-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default Voter