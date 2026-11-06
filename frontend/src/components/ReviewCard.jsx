import { Grid, Card, Typography ,Rating} from "@mui/material";
import "../stylesheets/review.scss";

const reviews = [
    {
        name: "Sara K.",
        rating: 5,
        text: "Beautiful quality prints, love the texture and colors!",
        date: "Oct 2025",
    },
    {
        name: "Ali M.",
        rating: 4,
        text: "Fast delivery and great packaging. Highly recommend.",
        date: "Sept 2025",
    },
    {
        name: "Nadia F.",
        rating: 4.5,
        text: "The prints look exactly as shown online, amazing!",
        date: "Aug 2025",
    },
    {
        name: "Usman R.",
        rating: 5,
        text: "Perfect size and excellent quality. Will order again.",
        date: "July 2025",
    }   
];

const ReviewCard = () => {
    return (
        <div className="review_section">
            <Typography variant="h4" fontFamily={"PlayFair Display"} m={4} align="center">Customer Reviews</Typography>

            <Grid container spacing={4} className="grid" justifyContent='center'>
                {reviews.map((review, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{
                            width:200,
                            height:120,
                            p:5,
                            bgcolor:"secondary.main"
                        }}>
                            <Typography variant="h5">{review.name}</Typography>
                            <Typography variant="body">{review.text}</Typography>
                            <Rating name="read-only"  value={review.rating} readOnly sx={{color:"contrast.main"}}/>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default ReviewCard;
