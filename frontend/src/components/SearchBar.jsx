import React, { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { Box, InputBase, Paper, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { styled } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Search = styled(Box)({
  position: 'relative',
  borderRadius: 5,
  backgroundColor: '#ffffff7e',
  '&:hover': { backgroundColor: '#ffffff91' },
  width: 200,
  height: 35,
  display: 'flex',
  alignItems: 'center',
});

const SearchIconWrapper = styled('div')({
  position: 'absolute',
  left: 8,
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: 'inherit',
});

const StyledInputBase = styled(InputBase)({
  color: 'inherit',
  paddingLeft: '2rem',
  width: '100%',
});

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      try {
        const res = await axios.get('/api/artwork/getArtworks');
        // filter results on frontend
        const filtered = res.data.artworks.filter(artwork =>
          artwork.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } catch (err) {
        console.error("Search API error:", err);
      }
    };

    const timer = setTimeout(fetchResults, 300); //so that every single keystroke dont call api
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search Artworks"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Search>

      {results.length > 0 && (
        <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000 }}>
          <List>
            {results.map((artwork) => (
              <ListItem key={artwork.artwork_id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(`/detail/${artwork.artwork_id}`);
                    setQuery('');
                    setResults([]);
                  }}
                >
                  <ListItemText primary={artwork.title} secondary={artwork.artist_name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
