import React,{useState} from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import axios from 'axios'
function Login() {
    const [values, setValues] = useState({
        email:'',
        password:''
    })
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const handleSubmit =(event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/login', values,{ withCredentials:true })
        .then(res => {
            if (res.data.Status === "Login Successful") {
                navigate('/');
            } else {
                alert(res.data.Error || "Login failed");
            }

        })
        .catch(err => console.log(err))
    }
  return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh', backgroundColor: '#a50dfdff'}}>
      <div className="bg-white p-4 rounded shadow" style={{width: '100%', maxWidth: '420px'}}>
        <h2 className="text-center text-primary mb-3">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label"><strong>Email</strong></label>
            <input type="email" placeholder="Enter Email" name="email" 
            onChange={e => setValues({...values,email: e.target.value})} className="form-control rounded-0" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label"><strong>Password</strong></label>
            <input type="password" placeholder="Enter Password" name="password" 
            onChange={e => setValues({...values,password: e.target.value})} className="form-control rounded-0" />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0 mb-2">Log in</button>
          <p className="text-center text-muted small">By logging in you agree to our terms</p>
          <Link to="/register" className="btn btn-outline-primary w-100 rounded-0">Create Account</Link>
        </form>
      </div>
    </div>
  )
}

export default Login
