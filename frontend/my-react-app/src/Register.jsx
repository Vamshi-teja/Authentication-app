import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register(){
    const [values, setValues] = useState({
        name:'',
        email:'',
        password:''
    })
    const navigate = useNavigate();
    const handleSubmit =(event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/register', values, { withCredentials: true })
        .then(res => {
            if (res.data.Status ==="User Registered Successfully")
            {
                navigate('/login')
            } else{
                alert("Error");
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh', backgroundColor: 'rgba(37, 13, 253, 1)'}}>
            <div className ='bg-white p-4 rounded shadow' style={{width: '100%', maxWidth: '420px'}}>
                <h2 className="text-center text-primary mb-3">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                   <div className ='mb-3'>
                        <label htmlFor='name' className='form-label'><strong>Name</strong></label>
                        <input type='text' placeholder='Enter Name' name='name'
                        onChange={e => setValues({...values,name: e.target.value})}className='form-control rounded-0'/>
                    </div>    
                    <div className ='mb-3'>
                        <label htmlFor='email' className='form-label'><strong>Email</strong></label>
                        <input type='email' placeholder='Enter Email' name='email'
                        onChange={e => setValues({...values,email: e.target.value})}className='form-control rounded-0'/>

                    </div>
                    <div className ='mb-3'>
                        <label htmlFor='password' className='form-label'><strong>Password</strong></label>
                        <input type='password' placeholder='Enter Password' name='password'
                        onChange={e => setValues({...values,password: e.target.value})}className='form-control rounded-0'/>
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0 mb-2'>Sign up</button>
                    <p className='text-center text-muted small'>You agree to our terms and conditions</p>
                    <Link to="/login" className='btn btn-outline-primary w-100 rounded-0'>Login</Link>
                </form>
            </div>

        </div>
    )
}
export default Register