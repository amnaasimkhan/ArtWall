import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Button, Typography, TextField, Paper } from "@mui/material"
import { AuthContext } from '../../context/AuthContext'

const Login = () => {

  //take input
  const [inputs, setInputs] = useState({
    name: "",
    password: "",
    role: "admin"
  })

  //for error like missing input (do i need the middleware then?) yes i do
  const [error, setError] = useState(null)

  //to redirect to homepage incase of succesful login
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(inputs)
  }

  const submitInfo = async e => {
    e.preventDefault();
    try {
      await login(inputs)         //we took the api request, put it in context to make it a global thing cuz almsot every page needs auth
      navigate("/admin")         //successful then go to login
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  }

  return (

    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: "primary.main",
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper elevation={2}
        sx={{
          p: 4,
          width: 300,
          height: 350,
          borderRadius: 2,
          bgcolor: 'secondary.main'
        }}
      >
        <Typography variant="h4" gutterBottom align="center" margin={3}>
          ADMIN LOGIN
        </Typography>

        <Box
          component="form"
          onSubmit={submitInfo}
          sx={{
            display: "flex",

            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Username"
            name="name"
            value={inputs.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="contrast">
            Login
          </Button>
        </Box>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}


      </Paper>
    </Box>



    // <div className='body'>
    //   <div className='container'>
    //     <h1>Login</h1>
    //     <form>
    //       <div className="box">
    //         <input type="text" placeholder='name' name="name" onChange={handleChange}/>
    //         <input type="password" placeholder='password' name="password" onChange={handleChange}/>
    //         <button onClick={submitInfo}>Login</button>
    //       </div>
    //     </form>
    //     {error && <p>{error}</p>} 
    //     <span>Don't have an account? <Link to="/register">Sign up Now</Link></span>
    //   </div>
    // </div> 
  )
}

export default Login