import React, {useEffect, useState} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {ArrowForward, FilterAlt} from '@mui/icons-material'
import {useRouter} from 'next/router'
import {deepPurple, grey} from '@mui/material/colors'
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
        <Stack
            alignItems="center"
            py={2}
            spacing={5}
            sx={{xs: {px: 10}, md: {px: 30}, lg: {px: 50}}}
        >
            <Stack width="50%">
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}
                    width="100%"
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

                <Stack justifyContent="center" direction="row" width="100%">
                    <Typography fontSize={30} fontWeight={500}>
                        Pokedex ({data?.length})
                    </Typography>
                </Stack>
            </Stack>

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
                <Grid container spacing={2} columns={24} maxWidth={700}>
                    {data.map((pokemon, index) => (
                        <Grid item key={index} sm={24} lg={12}>
                            <Stack
                                alignItems="center"
                                direction="row"
                                justifyContent="center"
                                minHeight={100}
                                borderRadius={2}
                                boxShadow={2}
                                border={`1px solid ${grey[200]}`}
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

                                <Typography>{pokemon.name}</Typography>
                            </Stack>
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
                    message={`Comparing: ${Object.keys(checkedPokemon)?.join(
                        ', ',
                    )}`}
                />
            </Snackbar>
        </Stack>
    )
}
