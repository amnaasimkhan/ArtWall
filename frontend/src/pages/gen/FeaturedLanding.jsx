import { Typography } from '@mui/material'
import ImageGrid from '../../components/ImageGrid'

const FeaturedLanding = () => {
    return (
        <>
            <div style={{ marginLeft: 30, marginRight: '40%' }}>
                <Typography variant="h4" gutterBottom fontStyle='italic' fontFamily='Playfair Display' py={2} >
                    Featured Artists
                </Typography>
                <Typography variant="subtitle" >
                    Discover the work of our featured artists, whose unique vision and creative style set them apart. By exploring their pieces, you can appreciate the craftsmanship, techniques, and storytelling woven into each artwork. Their collection offers insight into their inspirations and artistic journey. This spotlight highlights their contribution to the art community and invites you to experience their work in a meaningful way.
                </Typography>
            </div>
            
            <ImageGrid size={{ width: 280, height: 'auto' }} num={3} type={'featured'} />
        </>

    )
}

export default FeaturedLanding