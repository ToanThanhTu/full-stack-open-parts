const { test, describe, expect, beforeEach } = require('@playwright/test')

const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })

        await page.goto('/')
    })

    test('front page can be opened', async ({ page }) => {
        const locator = await page.getByText('Notes').first()
        await expect(locator).toBeVisible()

        await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2023')).toBeVisible()
    })

    test('user can log in', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
        await expect(page.getByText('Matti Luukkainen logged-in')).toBeVisible()
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
        })

        test('a new note can be created', async ({ page }) => {
            await createNote(page, 'a note created by playwright')
            await expect(page.getByText('a note created by playwright').first()).toBeVisible()
        })

        describe('and a note exists', () => {
            beforeEach(async ({ page }) => {
                await createNote(page, 'another note created by playwright')
            })

            test('importance can be changed', async ({ page }) => {
                await page.getByRole('button', { name: 'make not important' }).click()
                await expect(page.getByText('make important')).toBeVisible()
            })
        })

        describe('and several note exist', () => {
            beforeEach(async ({ page }) => {
                await createNote(page, 'first note', true)
                await createNote(page, 'second note', true)
                await createNote(page, 'third note', true)
            })

            test('one of those can be made nonimportant', async ({ page }) => {
                // const otherNoteElement = await page.getByText('first note')

                // await page
                //     .getByText('first note')
                //     .getByRole('button', { name: 'make not important' })
                //     .click()
                // await expect(
                //     page
                //         .getByText('first note')
                //         .getByText('make important')
                // ).toBeVisible()

                // ------------------------------

                // const otherNoteText = await page.getByText('first note')
                // const otherNoteElement = await otherNoteText.locator('..')

                // await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
                // await expect(otherNoteElement.getByText('make important')).toBeVisible()

                // -------------------------------

                // const secondNoteElement = await page.getByText('second note').locator('..')

                // await secondNoteElement.getByRole('button', { name: 'make not important'}).click()
                // await expect(secondNoteElement.getByText('make important')).toBeVisible()

                // -------------------------------

                await page.pause()
                
                const otherNoteText = await page.getByText('second note')
                const otherNoteElement = await otherNoteText.locator('..')

                await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
                await expect(otherNoteElement.getByText('make important')).toBeVisible()
            })

            test('Checking for things', async ({ page }) => {
                const first = await page.getByText('first note')

                const firstContent = await first.evaluate(note => note.content)
                console.log(firstContent)                
            })
        })
    })

    test('login fails with wrong password', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'wrong')

        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
})