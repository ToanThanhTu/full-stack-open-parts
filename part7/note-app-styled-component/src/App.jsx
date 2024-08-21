/* eslint-disable react/prop-types */
import { useState } from 'react'
import {
  Routes, Route, Link,
  useNavigate,
  // useParams,
  Navigate,
  useMatch
} from 'react-router-dom'

import { Alert, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { Button, Footer, Input, Navigation, Page } from './App.styles'

const Home = () => (
  <div>
    <h2>TKTL notes app</h2>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
  </div>
)

const Note = ({ note }) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}

const Notes = ({ notes }) => (
  <div>
    <h2>Notes</h2>

    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {notes.map(note => (
            <TableRow key={note.id}>
              <TableCell>
                <Link to={`/notes/${note.id}`}>{note.content}</Link>
              </TableCell>
              <TableCell>
                {note.user}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)

const Users = () => (
  <div>
    <h2>TKTL notes app</h2>
    <ul>
      <li>Matti Luukkainen</li>
      <li>Juha Tauriainen</li>
      <li>Arto Hellas</li>
    </ul>
  </div>
)

const Login = (props) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()

    props.onLogin('mluukkai')
    navigate('/')
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username:
          <Input />
        </div>
        <div>
          password:
          <Input type='password' />
        </div>
        <div>
          <Button type='submit' primary=''>
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

const Menu = ({ user }) => {
  const padding = {
    margin: 5
  }

  return (
    <Navigation>
      <Link style={padding} to='/'>home</Link>
      <Link style={padding} to='/notes'>notes</Link>
      <Link style={padding} to='/users'>users</Link>
      {user
        ? <em>{user} logged in</em>
        : <Link style={padding} to='/login'>login</Link>
      }
    </Navigation>
  )
}

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: 'HTML is easy',
      important: true,
      user: 'Matti Luukkainen'
    },
    {
      id: 2,
      content: 'Browser can execute only JavaScript',
      important: false,
      user: 'Matti Luukkainen'
    },
    {
      id: 3,
      content: 'Most important methods of HTTP-protocol are GET and POST',
      important: true,
      user: 'Arto Hellas'
    }
  ])

  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const login = (user) => {
    setUser(user)
    setMessage(`welcome ${user}`)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
  }

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  return (
    <Page>
        {(message &&
          <Alert severity='success'>
            {message}
          </Alert>
        )}
        <Menu user={user} />

        <Routes>
          <Route path='/notes/:id' element={<Note note={note} />} />
          <Route path="/notes" element={<Notes notes={notes} />} />
          <Route path="/users" element={user ? <Users /> : <Navigate replace to='/login' />} />
          <Route path='/login' element={<Login onLogin={login} />} />
          <Route path="/" element={<Home />} />
        </Routes>

        <Footer>
          <em>Note app, Department of Computer Science 2024</em>
        </Footer>
    </Page>
  )
}

export default App