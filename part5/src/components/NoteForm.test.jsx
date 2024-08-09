import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
    const createNote = vi.fn()
    const user = userEvent.setup()

    render(<NoteForm createNote={createNote} />)

    // const { container } = render(<NoteForm createNote={createNote} />)
    // const input = container.querySelector('#note-input')

    const input = screen.getByPlaceholderText('write note content here')
    // const input = screen.getByRole('textbox')
    const sendButton = screen.getByText('save')

    await user.type(input, 'testing a form...')
    await user.click(sendButton)

    expect(createNote.mock.calls).toHaveLength(1)
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...')

    console.log(createNote.mock.calls)
})