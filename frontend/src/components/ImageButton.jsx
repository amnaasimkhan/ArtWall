import { ToggleButton, ToggleButtonGroup } from "@mui/material"



const ImageButton = () => {

    const imageUrl = "https://picsum.photos/400/500?random=7"
    const imageUrl_2 = "https://picsum.photos/400/500?random=3"
    return (
        <div>
            <ToggleButtonGroup sx={{gap:2}}>
                <ToggleButton
                    value="image"
                    sx={{
                        height:130,
                        width:100,
                        p: 0,
                        border: "none"
                    }}
                >
                    <img src={imageUrl} alt="preview" width="100" />
                </ToggleButton>

                <ToggleButton
                    value="image"
                    sx={{
                        height:130,
                        width:100,
                        p: 0,
                        border: "none"
                    }}
                >
                    <img src={imageUrl_2} alt="preview" width="100" />
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
}

export default ImageButton