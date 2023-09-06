import React from 'react'

function Start() {
  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm text-center'>
                <h2>Login As</h2>
                <div className='d-flex justify-content-between mt-5'>
                    <button className='btn btn-primary btn-lg'>Voter</button>
                    <button className='btn btn-success btn-lg'>Admin</button>
                </div>
            </div>
        </div>
  )
}

export default Start