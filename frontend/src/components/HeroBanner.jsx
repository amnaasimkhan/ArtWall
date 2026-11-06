import { Link } from "react-router-dom"
import "../stylesheets/herobanner.scss"
import { Button, Typography } from "@mui/material"


const HeroBanner = (props) => {

    return (
        <div className="banner">
            {props.picture ?
                <img src={props.picture} alt="picture" /> :
                <video src={props.video} loop muted autoPlay />
            }
            <div className={`content ${props.direction === 'right' ? '_right' : ''}`}>
                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", textShadow: "0 6px 10px rgba(0, 0, 0, 1)" }} fontWeight={600}>
                    {props.title}
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", textShadow: "0 6px 10px rgba(0, 0, 0, 1)" }}>
                    {props.text}
                </Typography>
                {props.buttonText && props.buttonLink &&
                    <Button
                        component={Link}
                        to={props.buttonLink}
                        sx={{
                            bgcolor: 'contrast.main',
                            color: 'inherit',
                            width: 'fit-content',
                            fontSize: '25px',
                            transition: 'box-shadow 0.3s',
                            '&:hover': {
                                boxShadow: 3,
                            }
                        }}>
                        {props.buttonText}
                    </Button>
                }

            </div>
        </div>

    )
}

export default HeroBanner