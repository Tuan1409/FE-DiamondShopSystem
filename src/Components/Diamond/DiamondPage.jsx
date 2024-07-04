import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  diamondShopContainer: {
    padding: theme.spacing(4),
  },
  diamondGrid: {
    marginTop: theme.spacing(4),
  },
  diamondCard: {
    cursor: 'pointer',
    '&:hover': {
      boxShadow: theme.shadows[5],
    },
  },
  diamondImage: {
    height: 140,
  },
  viewMoreButton: {
    marginTop: theme.spacing(4),
  },
}));

const DiamondPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [diamonds, setDiamonds] = useState([]);

  useEffect(() => {
    const fetchDiamonds = async () => {
      try {
        const response = await fetch('https://localhost:7122/api/Diamond/GetDiamondList');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDiamonds(data.items);
      } catch (error) {
        console.error('Error fetching the diamond list:', error);
      }
    };

    fetchDiamonds();
  }, []);

  const handleClick = (diamond) => {
    navigate(`/diamond-detail/${diamond.id}`, { state: { diamond } });
  };

  return (
    <Container className={classes.diamondShopContainer}>
      <Typography variant="h4" component="h1">
        The Diamonds
      </Typography>

      <Grid container spacing={4} className={classes.diamondGrid}>
        {diamonds.map((diamond, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card className={classes.diamondCard} onClick={() => handleClick(diamond)}>
              <CardMedia
                className={classes.diamondImage}
                image={diamond.images && diamond.images[0] ? diamond.images[0].urlPath : ''}
                title={diamond.name}
              />
              <CardContent>
                <Typography variant="h6">{diamond.name}</Typography>
                <Typography variant="body2">Diamond Story</Typography>
                <Typography variant="h6" color="textSecondary">
                  {diamond.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" className={classes.viewMoreButton}>
        View More
      </Button>
    </Container>
  );
};

export default DiamondPage;
