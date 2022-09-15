import React from 'react'
import Image from 'next/image'
import {Typography, Stack, Chip} from '@mui/material'

const MoleculePokemonCard = ({name, thumbnail, types}) => {
    return (
        <Stack
            alignItems="center"
            bgcolor="white"
            direction="column"
            justifyContent="center"
            key={name}
            borderRadius={3}
            spacing={2}
            p={5}
            sx={{
                boxShadow: '-4px 2px 9px 8px rgba(0,0,0,0.14)',
            }}
        >
            <Image
                loader={() => thumbnail}
                src={thumbnail}
                alt={name}
                width={150}
                height={150}
            />

            <Typography variant="h5">{name}</Typography>

            <Stack direction="row" spacing={1}>
                {types.map(({type: {name}}, index) => {
                    return <Chip key={index} label={name} size="small" />
                })}
            </Stack>
        </Stack>
    )
}

export default MoleculePokemonCard
