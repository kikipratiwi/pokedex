import {Paper} from '@mui/material'
import {styled} from '@mui/material/styles'

const AtomCard = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}))

export default AtomCard
