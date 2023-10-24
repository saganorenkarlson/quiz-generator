import React, { useState } from 'react'
import { InputAdornment, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Search from '@mui/icons-material/Search';
import '../styles/startpage.css'


export const StartPage = () => {
    const navigate = useNavigate();

    const [query, setQuery] = useState<string>('');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/search?query=${query}&page=1`);
    }
    return (
        <div className="start-page-wrapper">
            <Typography fontSize={'42px'} fontWeight={'600'}>This is Quiz-generator</Typography>
            <Typography fontSize={'16px'}>Log in to create your own quizzes</Typography>
            <form className='search-form' onSubmit={handleSearch}>
                <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setQuery(event.target.value);
                    }}
                    placeholder={'Search course or user'}
                    size='medium'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </form>
        </div >
    )
}
