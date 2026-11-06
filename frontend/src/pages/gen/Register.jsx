import { useState  } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from "axios"
import {Box, Button, Typography, TextField, Paper} from "@mui/material"


//gotta hardcode two roles only
const Register = () => {

    const [inputs,setInputs]=useState({
        name:"",
        email:"",
        password:"",
        role:"customer",        //imma have a different login for admin (famous last words?)
    })

    const [error, setError] = useState(null)
    const navigate = useNavigate();


    const handleChange = e =>{
        setInputs(prev=>({...prev, [e.target.name]: e.target.value}));
    }
    const submitInfo = async e =>{

        e.preventDefault();
        try {
            await axios.post("/api/auth/register", inputs)
            navigate("/login")
        } catch (error) {
            setError(error.response.data);
        }
    }


    return (
        <Box
        sx={{
          height:"100vh",
          width:"100vw",
          bgcolor:"primary.main",
          display:"flex",
          alignItems:'center',
          justifyContent:'center'
        }}
      >
        <Paper elevation={2}
          sx={{
            p:4,
            width:300,
            height:400,
            borderRadius:2,
            bgcolor: 'secondary.main'
          }}
        >
         <Typography variant="h4" gutterBottom align="center" margin={3}>
          REGISTER
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
              />
              <TextField
                label="Email"
                type="email"
                name="email"
                value={inputs.email}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
                fullWidth
              />
              <Button type="submit" variant="contained" color="contrast">
                Register
              </Button>
        </Box>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Already have an account? {" "}
          <Link to="/login" style={{ color: "#a26769" }}>
            Login
          </Link>
        </Typography>

        </Paper>
      </Box>

    // <div className="body">
    // <div className="container">
    //     <h1>Register</h1>
    //     <form>
    //     <div className="box">
    //         <input required type="text" placeholder="name" name="name" onChange={handleChange} />
    //         <input required type="email" placeholder="email" name="email" onChange={handleChange} />
    //         <input required type="password" placeholder="password" name="password" onChange={handleChange} />
    //         <input required type="text" placeholder="role" name="role" onChange={handleChange} />
    //         <button onClick={submitInfo}>Register</button>
    //     </div>
    //     </form>
    //     {error && <p>{error}</p>}
    //     <span>
    //         Already have an account? <Link to="/login">Login</Link>
    //     </span>
    // </div>
    // </div>

  )
}

export default Register