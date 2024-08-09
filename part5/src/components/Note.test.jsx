import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Note from './Note'

test('renders content', () => {
    const note = {
        content: 'Does not work anymore :(',
        important: true
    }

    // test using CSS selector
    // const { container } = render(<Note note={note} />)

    // const div = container.querySelector('.note')
    // expect(div).toHaveTextContent('Component testing is done with react-testing-library')

    // test using screen
    render(<Note note={note} />)

    screen.debug()

    const element = screen.getByText('Does not work anymore :(', { exact: false })

    // screen.debug(element)

    expect(element).toBeDefined()
})

test('clicking the button calls event handler once', async () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    }

    const mockHandler = vi.fn()

    render(
        <Note note={note} toggleImportance={mockHandler} />
    )

    const user = userEvent.setup()
    const button = screen.getByText('make not important')
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
})

test('does not render this', () => {
    const note = {
        content: 'This is a reminder',
        important: true
    }

    render(<Note note={note} />)

    const element = screen.queryByText('do not want this thing to be rendered')
    expect(element).toBeNull()
})