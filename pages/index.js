import React, {useEffect, useState} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {ArrowForward, FilterAlt} from '@mui/icons-material'
import {useRouter} from 'next/router'
import {deepPurple} from '@mui/material/colors'
import {
    Checkbox,
    Typography,
    Grid,
    Stack,
    Button,
    Badge,
    Snackbar,
    Slide,
    SnackbarContent,
    Box,
} from '@mui/material'

import usePagination from '../hooks/usePagination'
import AtomLoading from '../components/atoms/Loading'
import AtomCard from '../components/atoms/Card'

export default function Home() {
    const router = useRouter()
    const MAX_COMPARED_ITEM = 4

    const [checkedPokemon, setCheckedPokemon] = useState({})
    const [invisibleFilterBadge, setInvisibleFilterBadge] = useState()
    const [isComparing, setIsComparing] = useState(false)
    const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false)
    const {data, next, setPage} = usePagination(
        'https://pokeapi.co/api/v2/pokemon',
    )

    const markPokemon = (event) => {
        const _newChoosenPokemon = checkedPokemon

        if (!event.target.checked) {
            delete checkedPokemon[event.target.name]
        } else {
            checkedPokemon[event.target.name] = event.target.checked
        }

        setCheckedPokemon({
            ..._newChoosenPokemon,
        })
    }

    useEffect(() => {
        if (Object.keys(checkedPokemon).length > 0 && !isSnackbarVisible) {
            console.log('kesini')
            setIsSnackbarVisible(true)
        }
    }, [checkedPokemon])

    const snackbarAction = (checkedPokemonLength) => (
        <React.Fragment>
            <Button
                size="small"
                disabled={checkedPokemonLength < 2}
                color="secondary"
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{textTransform: 'capitalize'}}
                onClick={() =>
                    router.push({
                        pathname: '/pokemon/compare',
                        query: {pokemon: [...checkedPokemonName]},
                    })
                }
            >
                Compare
            </Button>
        </React.Fragment>
    )

    const checkedPokemonName = [...Object.keys(checkedPokemon)]
    const checkedPokemonLength = checkedPokemonName.length

    return (
        <Box sx={{width: '100vw', height: '100vh', padding: '20px 400px'}}>
            <Stack>
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}
                >
                    <Button
                        variant="text"
                        color="secondary"
                        sx={{textTransform: 'capitalize'}}
                        onClick={() => setIsComparing(!isComparing)}
                    >
                        Compare
                    </Button>

                    <Badge
                        color="secondary"
                        variant="dot"
                        invisible={invisibleFilterBadge}
                    >
                        <FilterAlt />
                    </Badge>
                </Stack>

                <Typography>Pokedex ({data?.length})</Typography>

                <InfiniteScroll
                    dataLength={data.length}
                    hasMore={!!next}
                    loader={<AtomLoading />}
                    next={() => {
                        setPage((prev) => prev + 1)
                    }}
                    endMessage={
                        <p style={{textAlign: 'center'}}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    <Grid container spacing={2} columns={12} maxWidth={700}>
                        {data.map((pokemon, index) => (
                            <Grid item key={index} sx={12} md={6}>
                                <AtomCard elevation={1}>
                                    <Stack
                                        direction="row"
                                        justifyContent="flex-end"
                                        alignItems="center"
                                    >
                                        {isComparing && (
                                            <Checkbox
                                                name={pokemon.name}
                                                onClick={markPokemon}
                                                color="secondary"
                                                disabled={
                                                    !checkedPokemonName.includes(
                                                        pokemon.name,
                                                    ) &&
                                                    checkedPokemonLength ===
                                                        MAX_COMPARED_ITEM
                                                }
                                                checked={checkedPokemonName.includes(
                                                    pokemon.name,
                                                )}
                                            />
                                        )}
                                    </Stack>

                                    <Typography>{pokemon.name}</Typography>
                                </AtomCard>
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>

                <Snackbar
                    ClickAwayListenerProps={{onClickAway: () => null}}
                    onClose={() => setIsSnackbarVisible(false)}
                    severity="info"
                    open={isSnackbarVisible && checkedPokemonLength > 0}
                    TransitionComponent={(props) => {
                        return <Slide {...props} direction="up" />
                    }}
                    key={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <SnackbarContent
                        action={snackbarAction(checkedPokemonLength)}
                        style={{
                            backgroundColor: deepPurple[300],
                        }}
                        message={`Comparing: ${Object.keys(
                            checkedPokemon,
                        )?.join(', ')}`}
                    />
                </Snackbar>
            </Stack>
        </Box>
    )
}
