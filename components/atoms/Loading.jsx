import React from 'react'
import {Grid, Skeleton} from '@mui/material'
import {Stack} from '@mui/system'

const AtomLoading = () => {
    return (
        <Grid
            container
            rowSpacing={2}
            columnSpacing={2}
            columns={12}
            maxWidth={700}
            paddingY={2}
        >
            <Grid item sx={12} md={6}>
                <Skeleton variant="rounded" width={'100%'} height={60} />
            </Grid>
            <Grid item sx={12} md={6}>
                <Skeleton variant="rounded" width={'100%'} height={60} />
            </Grid>
        </Grid>
    )
}

export default AtomLoading
