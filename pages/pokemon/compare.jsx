import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {ArrowBack} from '@mui/icons-material'
import {Box, Stack} from '@mui/system'
import {Button, LinearProgress, Paper, Typography} from '@mui/material'
import {useRouter} from 'next/router'
import MoleculePokemonCard from '../../components/molecules/PokemonItem'

function ComparePage() {
    const router = useRouter()

    const {pokemon: pokemons} = router.query
    const [pokemonDetailData, setPokemonDetailData] = useState()

    useEffect(() => {
        if (!router.isReady) return

        if (!pokemons || pokemons.length < 1) router.back()
        getPokemonsDetail()
    }, [router])

    const getPokemonsDetail = async () => {
        try {
            const response = await axios.all(
                pokemons
                    .map((name) => `https://pokeapi.co/api/v2/pokemon/${name}`)
                    .map((endpoint) => axios.get(endpoint)),
            )

            setPokemonDetailData(
                response.map(
                    ({
                        data: {
                            name,
                            height,
                            weight,
                            stats,
                            types,
                            sprites: {
                                other: {
                                    'official-artwork': {front_default},
                                },
                            },
                        },
                    }) => ({
                        name,
                        thumbnail: front_default,
                        height,
                        weight,
                        stats,
                        types,
                    }),
                ),
            )
        } catch (error) {
            console.error(error.message)
        }
    }

    if (!pokemonDetailData) return <Typography>loading...</Typography>

    return (
        <Stack p={5} spacing={3}>
            <Button
                style={{alignSelf: 'flex-start'}}
                size="small"
                color="secondary"
                variant="contained"
                endIcon={<ArrowBack />}
                sx={{textTransform: 'capitalize'}}
                onClick={() =>
                    router.push({
                        pathname: '/',
                    })
                }
            >
                Back to List
            </Button>

            <Stack direction="row" justifyContent="center" spacing={4}>
                {pokemonDetailData &&
                    pokemonDetailData.map(({name, thumbnail, types}) => {
                        return (
                            <MoleculePokemonCard
                                key={name}
                                name={name}
                                thumbnail={thumbnail}
                                types={types}
                            />
                        )
                    })}
            </Stack>

            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <Paper elevation={3} width={500} sx={{padding: 2}}>
                    <Typography variant="h6">Basic</Typography>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Box width={200}>
                            <Typography>Height</Typography>
                            <Typography>Weight</Typography>
                        </Box>

                        {pokemonDetailData.map(({height, weight}, index) => {
                            return (
                                <Box key={index} width={250}>
                                    <Typography>{`${height} "`}</Typography>
                                    <Typography>{weight} lbs</Typography>
                                </Box>
                            )
                        })}
                    </Stack>
                </Paper>

                <Paper elevation={3} width={500} sx={{padding: 2}}>
                    <Typography variant="h6">Stats</Typography>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Box width={150}>
                            {pokemonDetailData &&
                                pokemonDetailData[0].stats.map(
                                    ({stat: {name}}) => (
                                        <Typography key={name}>
                                            {name}
                                        </Typography>
                                    ),
                                )}
                        </Box>

                        <Stack direction="row" spacing={5} width={500}>
                            {pokemonDetailData &&
                                pokemonDetailData.map((data, index) => (
                                    <Stack
                                        key={index}
                                        width={150}
                                        direction="column"
                                        spacing={2.5}
                                    >
                                        {data.stats.map(
                                            (
                                                {base_stat, stat: {name}},
                                                index,
                                            ) => (
                                                <LinearProgress
                                                    color="secondary"
                                                    key={index}
                                                    variant="determinate"
                                                    value={base_stat}
                                                />
                                            ),
                                        )}
                                    </Stack>
                                ))}
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </Stack>
    )
}

export default ComparePage
